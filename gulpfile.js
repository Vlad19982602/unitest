'use strict';

const gulp = require("gulp");
const webpack = require("webpack-stream");
const browsersync = require("browser-sync");

const dist = "./dist/"; //эквивалентны с записью ниже
//const dist = "/OpenServer/domains/ForFourCourseMIDIS/dist";

gulp.task("copy-html", () => {
    return gulp.src("src/*.html")
                .pipe(gulp.dest(dist))
                .pipe(browsersync.stream());
});

gulp.task("build-js", () => {
    return gulp.src("src/js/script.js")
                .pipe(webpack({
                    mode: 'development',
                    output: {
                        filename: 'js/script.js'
                    },
                    watch: false,
                    devtool: "source-map",
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist))
                .on("end", browsersync.reload);
});

gulp.task("build-dist", () => {
    return gulp.src("src/**/*.*")
                .pipe(gulp.dest(dist))
                .on("end", browsersync.reload);
});

gulp.task("watch", () => {
    browsersync.init({
        server: {
            baseDir: "dist/",
            serveStaticOptions: {
                extensions: ["html"]
            }
        },
		port: 4000,
		notify: true
    });
    
    gulp.watch("src/*.html", gulp.parallel("copy-html"));
    gulp.watch("src/**/*.*", gulp.parallel("build-dist"));
    gulp.watch("src/js/**/*.js", gulp.parallel("build-js"));
});

gulp.task("prod", () => {
	gulp
		.src("./src/sass/style.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(gulp.dest(dist));

	return gulp
		.src("./src/js/script.js")
		.pipe(
			webpack({
				mode: "production",
				output: {
					filename: "script.js",
				},
				module: {
					rules: [
						{
							test: /\.m?js$/,
							exclude: /(node_modules|bower_components)/,
							use: {
								loader: "babel-loader",
								options: {
									presets: [
										[
											"@babel/preset-env",
											{
												corejs: 3,
												useBuiltIns: "usage",
											},
										],
									],
								},
							},
						},
					],
				},
			})
		)
		.pipe(gulp.dest(dist));
});

gulp.task("build", gulp.parallel("copy-html", "build-dist", "build-js"));

gulp.task("default", gulp.parallel("watch", "build"));