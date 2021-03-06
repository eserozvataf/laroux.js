(function () {
    'use strict';

    var gulp = require('gulp'),
        config = require('../config/tasks.common'),
        pkg = require('../../package.json'),
        handleErrors = require('../utils/handleErrors'),
        resolvePath = require('../utils/resolvePath'),
        concat = require('gulp-concat'),
        csscomb = require('gulp-csscomb'),
        header = require('gulp-header'),
        taskList = [];

    Object.keys(config.bundles).forEach(function (item) {
        var bundle = config.bundles[item],
            taskName = 'pack:' + item,
            subtaskList = [],
            subtaskCount = 0,

            bundleInfo = {
                name: pkg.name,
                bundle: item,
                description: pkg.description,
                version: pkg.version,
                link: pkg.homepage,
                license: pkg.license
            };

        Object.keys(bundle.packs).forEach(function (item2) {
            var pack = bundle.packs[item2],
                subtaskName = taskName + ':' + subtaskCount++;

            gulp.task(subtaskName, ['lint', 'browserify'], function () {
                var stream = gulp.src(resolvePath.array(pack.files))
                    .on('error', handleErrors);

                if (pack.concat) {
                    stream = stream.pipe(concat(pack.concat));
                }

                if (pack.csscomb) {
                    stream = stream.pipe(csscomb({
                        configPath: './etc/config/.csscomb.json'
                    }));
                }

                if (pack.header) {
                    stream = stream.pipe(header(
                        bundle.banner,
                        { pkg: bundleInfo }
                    ));
                }

                return stream.pipe(gulp.dest(pack.dest));
            });

            subtaskList.push(subtaskName);
        });

        gulp.task(taskName, subtaskList);

        taskList.push(taskName);
    });

    gulp.task('pack', taskList);

}());
