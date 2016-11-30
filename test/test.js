var mock = require('mock-fs');
var getRootPath = require('../index.js');
var expect = require('chai').expect;
var path = require('path');
describe('git-root-path', function() {
    beforeEach(function() {
        mock({
            rootdir:{
                git_root:{
                    ".git":{
                        "index":"//index file inside .git folder"
                    },
                    "submodule":{
                        "deep_sub_module":{
                            'package.json': '{}'
                        }
                    }
                }
            },
            rootdir2:{
                git_root:{
                    ".git":{
                        "index":"//index file inside .git folder;"
                    },
                    "submodule":{
                        "deep_sub_module":{
                            'package.json': '{}'
                        }
                    }
                }
            },
            rootdir3:{
                gitless_root:{
                    "submodule":{
                        "deep_sub_module":{
                            'package.json': '{}'
                        }
                    }
                }
            }
        });
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
        var case1 = getRelativeCrossPlatformPath(getRootPath("rootdir/git_root/submodule/deep_sub_module"));
        var case2 = getRelativeCrossPlatformPath(getRootPath("rootdir2/git_root/submodule/deep_sub_module"));
        
        expect(case1).to.equal("rootdir/git_root");
        expect(case2).to.equal("rootdir2/git_root");
    });
    
    it('should throw error if not a git repository',function(){
        function getRootPathForFolderWithoutGit(){
            return getRootPath("rootdir3/gitless_root/submodule/deep_sub_module");
        }
        expect(getRootPathForFolderWithoutGit).to.throw();
    });

    it('should throw error if path is invalid',function(){
        function getRootPathForNonExistingFolder1(){
            return getRootPath("rootdir/git_root/submodule/deep_sub_module/non_existing_folder");
        }
        function getRootPathForNonExistingFolder2(){
            return getRootPath("non_existing_folder/git_root/submodule/deep_sub_module");
        }
        function getRootPathForNonExistingFolder3(){
            return getRootPath("rootdir/git_root/submodule/non_existing_folder/deep_sub_module");
        }
        expect(getRootPathForNonExistingFolder1).to.throw();
        expect(getRootPathForNonExistingFolder2).to.throw();
        expect(getRootPathForNonExistingFolder3).to.throw();
    });

    
});