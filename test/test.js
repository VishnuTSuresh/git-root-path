var mock = require('mock-fs');
var gitRootPath = require('../index.js');
var expect = require('chai').expect;
var path = require('path');
var mock_directory_structure = require('./mock_directory_structure.json');
describe('git-root-path', function() {

    beforeEach(function() {
        mock(mock_directory_structure);
    });

    afterEach(function() {
        mock.restore();
    });

    it('should return root path of git repository', function() {
        var length_of_path_till_root=path.resolve(".").length+1;
        function getRelativeCrossPlatformPath(path){
            var path_without_root=path.slice(length_of_path_till_root); //root is not same in all platforms: windows:F:\helloworld, unix:/helloworld
            var path_with_forward_slash=path_without_root.replace(/\\/g, "/");
            var cross_platform_relative_path=path_with_forward_slash;
            return cross_platform_relative_path;
        }
        var case1 = getRelativeCrossPlatformPath(gitRootPath("rootdir/git_root/submodule/deep_sub_module"));
        var case2 = getRelativeCrossPlatformPath(gitRootPath("rootdir2/git_root/submodule/deep_sub_module"));
        var case_absolute_path = getRelativeCrossPlatformPath(gitRootPath(path.resolve("rootdir/git_root/submodule/deep_sub_module")));
        expect(case1).to.equal("rootdir/git_root");
        expect(case2).to.equal("rootdir2/git_root");
        expect(case_absolute_path).to.equal("rootdir/git_root");
    });
    
    it('should throw error if not a git repository',function(){
        function gitRootPathForFolderWithoutGit(){
            return gitRootPath("rootdir3/gitless_root/submodule/deep_sub_module");
        }
        expect(gitRootPathForFolderWithoutGit).to.throw();
    });

    it('should throw error if path is invalid',function(){
        function gitRootPathForNonExistingFolder_trailing(){
            return gitRootPath("rootdir/git_root/submodule/deep_sub_module/non_existing_folder");
        }
        function gitRootPathForNonExistingFolder_leading(){
            return gitRootPath("non_existing_folder/git_root/submodule/deep_sub_module");
        }
        function gitRootPathForNonExistingFolder_middle(){
            return gitRootPath("rootdir/git_root/submodule/non_existing_folder/deep_sub_module");
        }
        expect(gitRootPathForNonExistingFolder_trailing).to.throw();
        expect(gitRootPathForNonExistingFolder_leading).to.throw();
        expect(gitRootPathForNonExistingFolder_middle).to.throw();
    });


});