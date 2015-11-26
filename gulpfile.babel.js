import gulp from 'gulp';
import bump from 'gulp-bump';
import git from 'gulp-git';
import filter from 'gulp-filter';
import tag from 'gulp-tag-version';
import changelog from 'gulp-conventional-changelog';

import runSequence from 'run-sequence';

var config = {
    importance: 'minor'
};

function getImportance() {
    return config.importance;
}

function release() {
    return runSequence('bump', 'changelog', 'commit-release');
}

gulp.task('changelog', function() {
    return gulp.src('CHANGELOG.md', {
            buffer: false
        })
        .pipe(changelog({
            preset: 'angular'
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('bump', function() {
    return gulp.src([
            './package.json'
        ])
        .pipe(bump({
            type: getImportance()
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('commit-release', function() {
    return gulp.src([
            './package.json',
            './CHANGELOG.md'
        ])
        .pipe(git.add({
            args: '-A'
        }))
        .pipe(git.commit(`chore(release): New ${getImportance()} release`))
        .pipe(filter('package.json'))
        .pipe(tag());
});

gulp.task('release:patch', function() {
    return release();
});

gulp.task('release:minor', function() {
    config.importance = 'minor';

    return release();
});

gulp.task('release:major', function() {
    config.importance = 'major';

    return release();
});
