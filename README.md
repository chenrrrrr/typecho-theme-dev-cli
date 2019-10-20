# typecho-theme-dev-cli
typecho主题开发脚手架-gulp构建-集成less,babel,browserify,csso,uglify

加入了版本控制

# 使用

```
cd ../usr/theme/
mkdir yourThemeName/
cd yourThemeName
git clone https://github.com/chenrrrrr/typecho-theme-dev-cli.git
gulp
```


# 配置文件
```
// 发版配置
var config = {
  env: "dev",
  theme_name: "Moz",
  release_version: "1.0.0"
};

module.exports = config;
```
如果发版，修改`env:"prod"`，`release_version:"版本号"`，主题目录自动生成全套文件，记得修改`index.php`头部注释哦！
