const fs = require('fs')
const path = require('path')
const ts = require('typescript')
const webpack = require('webpack')
const fastGlob = require('fast-glob')
const slsw = require('serverless-webpack')
const importFresh = require('import-fresh')
const nodeExternals = require('webpack-node-externals')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ConcatTextPlugin = require('concat-text-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const PermissionsOutputPlugin = require('webpack-permissions-plugin')

const config = require('./config')

const ignoreWarmupPlugin = require('./ignore-warmup-plugin')

// Load the default config for reference
// Note:  This import potentially clears our the dynamically loaded config. So any other
//        imports of the config after this, load the default config as well. Make sure to
//        use this after importing the config.
const defaultConfig = importFresh('./config')

const isLocal = slsw.lib.webpack.isLocal

const aliases = config.options.aliases
const servicePath = config.servicePath
const nodeVersion = config.nodeVersion
const externals = config.options.externals
const copyFiles = config.options.copyFiles
const concatText = config.options.concatText
const forceExclude = config.options.forceExclude
const ignorePackages = config.options.ignorePackages
const rawFileExtensions = config.options.rawFileExtensions
const fixPackages = convertListToObject(config.options.fixPackages)
const tsConfigPath = path.resolve(servicePath, config.options.tsConfig)

const ENABLE_STATS = config.options.stats
const ENABLE_SOURCE_MAPS = config.options.sourcemaps
const ENABLE_TYPESCRIPT = fs.existsSync(tsConfigPath)
const ENABLE_CACHING = isLocal ? config.options.caching : false

// Handle the "all" option in externals
// And add the forceExclude packages to it because they shouldn't be Webpacked
const computedExternals = (externals === 'all' ? [nodeExternals()] : externals).concat(forceExclude)

const extensions = ['.wasm', '.mjs', '.js', '.jsx', '.json', '.ts', '.tsx', '.graphql', '.gql']

function convertListToObject(list) {
  var object = {}

  for (var i = 0, l = list.length; i < l; i++) {
    object[list[i]] = true
  }

  return object
}

function resolveEntriesPath(entries) {
  for (let key in entries) {
    entries[key] = path.join(servicePath, entries[key])
  }

  return entries
}

function statModeToOctal(mode) {
  return (mode & parseInt('777', 8)).toString(8)
}

function babelLoader() {
  const plugins = [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ]

  if (ENABLE_SOURCE_MAPS) {
    plugins.push('babel-plugin-source-map-support')
  }

  return {
    loader: 'babel-loader',
    options: {
      // Enable caching
      cacheDirectory: ENABLE_CACHING,
      // Disable compresisng cache files to speed up caching
      cacheCompression: false,
      plugins: plugins.map(require.resolve),
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            targets: {
              node: nodeVersion,
            },
          },
        ],
      ],
    },
  }
}

function tsLoader() {
  return {
    loader: 'ts-loader',
    options: {
      projectReferences: true,
      configFile: tsConfigPath,
      experimentalWatchApi: true,
      transpileOnly: true,
    },
  }
}

function loaders() {
  const jsRule = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [babelLoader()],
  }

  const loaders = {
    rules: [
      jsRule,
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ],
  }

  if (ENABLE_TYPESCRIPT) {
    const tsRule = {
      test: /\.(ts|tsx)$/,
      use: [babelLoader(), tsLoader()],
      exclude: [
        [
          path.resolve(servicePath, 'node_modules'),
          path.resolve(servicePath, '.serverless'),
          path.resolve(servicePath, '.webpack'),
        ],
      ],
    }

    loaders.rules.push(tsRule)
  }

  if (rawFileExtensions && rawFileExtensions.length) {
    const rawFileRegex = `${rawFileExtensions.map(rawFileExt => `\\.${rawFileExt}`).join('|')}$`

    loaders.rules.push({
      test: new RegExp(rawFileRegex),
      loader: 'raw-loader',
    })
  }

  return loaders
}

function plugins() {
  const plugins = []

  if (ENABLE_CACHING) {
    plugins.push(
      new HardSourceWebpackPlugin({
        info: {
          mode: ENABLE_STATS ? 'test' : 'none',
          level: ENABLE_STATS ? 'debug' : 'error',
        },
      }),
    )
  }

  if (copyFiles) {
    plugins.push(
      new CopyWebpackPlugin({
        patterns: copyFiles.map(function (data) {
          return {
            to: data.to,
            context: servicePath,
            from: path.join(servicePath, data.from),
          }
        }),
      }),
    )

    // Copy file permissions
    const buildFiles = []
    copyFiles.forEach(function (data) {
      const entries = fastGlob.sync([data.from])
      // loop through each file matched by fg
      entries.forEach(function (entry) {
        // get source file stat
        const stat = fs.statSync(path.resolve(servicePath, entry))
        const { serverless } = slsw.lib
        if (serverless.service.package.individually && serverless.service.functions) {
          for (let key in serverless.service.functions) {
            buildFiles.push({
              fileMode: statModeToOctal(stat.mode),
              path: path.resolve(data.to, `.webpack/${key}`, entry),
            })
          }
        } else {
          buildFiles.push({
            fileMode: statModeToOctal(stat.mode),
            path: path.resolve(data.to, '.webpack/service', entry),
          })
        }
      })
    })
    plugins.push(new PermissionsOutputPlugin({ buildFiles }))
  }

  if (concatText) {
    const concatTextConfig = {}

    concatText.map(function (data) {
      concatTextConfig.files = data.files || null
      concatTextConfig.name = data.name || null
      concatTextConfig.outputPath = data.outputPath || null
    })

    plugins.push(new ConcatTextPlugin(concatTextConfig))
  }

  // Ignore all locale files of moment.js
  plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))

  // Ignore any packages specified in the `ignorePackages` option
  for (let i = 0, l = ignorePackages.length; i < l; i++) {
    plugins.push(new webpack.IgnorePlugin(new RegExp('^' + ignorePackages[i] + '$')))
  }

  if (fixPackages['formidable@1.x']) {
    plugins.push(new webpack.DefinePlugin({ 'global.GENTLY': false }))
  }

  return plugins
}

function resolvePlugins() {
  const plugins = []

  if (ENABLE_TYPESCRIPT) {
    plugins.push(
      new TsconfigPathsPlugin({
        configFile: tsConfigPath,
        extensions: extensions,
      }),
    )
  }

  return plugins
}

function alias() {
  return aliases.reduce((obj, item) => {
    const [key, value] = Object.entries(item)[0]
    obj[key] = path.join(servicePath, value)
    return obj
  }, {})
}

module.exports = ignoreWarmupPlugin({
  entry: resolveEntriesPath(slsw.lib.entries),
  target: 'node',
  context: __dirname,
  // Disable verbose logs
  stats: ENABLE_STATS ? 'normal' : 'errors-only',
  devtool: ENABLE_SOURCE_MAPS ? 'source-map' : false,
  externals: computedExternals,
  mode: isLocal ? 'development' : 'production',
  performance: {
    // Turn off size warnings for entry points
    hints: false,
  },
  resolve: {
    // Performance
    symlinks: false,
    extensions: extensions,
    alias: alias(),
    // First start by looking for modules in the plugin's node_modules
    // before looking inside the project's node_modules.
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    plugins: resolvePlugins(),
  },
  // Add loaders
  module: loaders(),
  // PERFORMANCE ONLY FOR DEVELOPMENT
  optimization: isLocal
    ? {
        splitChunks: false,
        removeEmptyChunks: false,
        removeAvailableModules: false,
        nodeEnv: false,
      }
    : {
        // Don't minimize in production
        // Large builds can run out of memory
        minimize: false,
        nodeEnv: false,
      },
  plugins: plugins(),
  node: {
    __dirname: false,
  },
})
