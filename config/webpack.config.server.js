const paths = require("./paths");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent"); // CSS Module의 고유 className을 만들 때 필요한 옵션

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss||sass)$/;
const sassModuleRegex = /\.module\.(scss||sass)$/;

module.exports = {
  mode: "production", // 프로덕션 모드로 설정하여 최적화 옵션들을 활성화
  entry: paths.ssrIndexJs, // 엔트리 경로
  target: "node", // node환경에서 시행될 것이라는 점을 명시
  output: {
    path: paths.ssrBuild, // 빌드 경로
    filename: "server.js", // 파일 이름
    chunkFilename: "js/[name].chunk.js", // 청크 파일 이름
    publicPath: paths.servedPath // 정적 파일이 제공될 경로
  },
  module: {
    rules: [
      {
        oneOf: [
          // js를 위한 처리
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: require.resolve("babel-loader"),
            options: {
              customize: require.resolve(
                "babel-preset-react-app/webpack-overrides"
              ),
              plugins: [
                [
                  require.resolve("babel-plugin-named-asset-import"),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: "@svgr/webpack?-svgo![path]"
                      }
                    }
                  }
                ]
              ],
              cacheDirectory: true,
              cacheCompression: false,
              compact: false
            }
          },
          // css를 위한 처리
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            // exportOnlyLocals: true 옵션 설정시 실제 css파일 생성하지 않음
            loader: require.resolve("css-loader"),
            options: {
              exportOnlyLocals: true
            }
          },
          // css module을 위한 처리
          {
            text: cssModuleRegex,
            loade: require.resolve("css-loader"),
            options: {
              modules: true,
              exportOnlyLocals: true,
              getLocalIdent: getCSSModuleLocalIdent
            }
          },
          // sass를 위한 처리
          {
            text: sassRegex,
            exclude: sassModuleRegex,
            use: [
              {
                loader: require.resolve("css-loader"),
                options: {
                  exportOnlyLocals: true
                }
              },
              require.resolve("sass-loader")
            ]
          },
          // sass+css module을 위한 처리
          {
            text: sassRegex,
            exclude: sassModuleRegex,
            use: [
              {
                loader: require.resolve("css-loader"),
                options: {
                  modules: true,
                  exportOnlyLocals: true,
                  getLocalIdent: getCSSModuleLocalIdent
                }
              },
              require.resolve("sass-loader")
            ]
          },
          // url-loader를 위한 설정
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve("url-loader"),
            options: {
              emitFile: false, //파일을 따로 저장하지 않는 옵션
              limit: 10000, //원래는 9.76kb가 넘어가면 파일로 저장하는데
              // emitFile값이 false일때는 경로만 준비하고 파일은 저장하지 않는다
              name: "static/media/[name].[hash:8].[ext]"
            }
          },
          // 위에서 설정된 확장자를 제외한 파일들은 file-loader를 사용
          {
            loader: require.resolve("file-loader"),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              emitFile: false, // 파일을 따로 저장하지 않는 옵션
              name: "static/media/[name].[hash:8].[ext]"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: ["node_modules"]
  }
};
