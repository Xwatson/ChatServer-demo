/**


* Created by xuwusheng on 15/7/22.
*/
module.exports = function(grunt) {
    //定义任务
    grunt.initConfig({
        watch: {
            jade: {
                files: ['views/**'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
                //tasks: ['jshint'],
                options: {
                    livereload: true
                }
            }
        },
        nodemon: {
            dev: {
                options: {
                    file: 'app.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['./'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    })


//只要文件修改更新就会重新执行注册的任务
    grunt.loadNpmTasks('grunt-contrib-watch')
//实施监听入口文件 自动重启
    grunt.loadNpmTasks('grunt-nodemon')
//针对慢任务优化构建的时间同时跑多个阻塞的任务 如编译less sass 等
    grunt.loadNpmTasks('grunt-concurrent')

//设置目的为了防止某个警告终端整个服务
    grunt.option('force', true)
//注册default任务
    grunt.registerTask('default', ['concurrent'])
}