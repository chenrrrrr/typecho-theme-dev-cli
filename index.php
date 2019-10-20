<?php

/**
 * Mozz
 * 
 * @package Mozz
 * @author 陈睿
 * @version 2.0
 * @link https://www.npmrundev.com
 */

if (!defined('__TYPECHO_ROOT_DIR__')) exit;
$this->need('header.php');
?>

<div id="main">
	<?php while ($this->next()) : ?>
		<article class="post">
			<h2 class="post-title">
				<a href="<?php $this->permalink() ?>"><?php $this->title() ?></a>
			</h2>
			<ul class="post-meta">
				<li><?php _e('作者: '); ?>
					<a href="<?php $this->author->permalink(); ?>" rel="author"><?php $this->author(); ?></a>
				</li>
				<li><?php _e('时间: '); ?>
					<time datetime="<?php $this->date('c'); ?>"><?php $this->date(); ?></time>
				</li>
				<li><?php _e('分类: '); ?><?php $this->category(','); ?></li>
				<li>
					<a href="<?php $this->permalink() ?>#comments"><?php $this->commentsNum('评论', '1 条评论', '%d 条评论'); ?></a>
				</li>
			</ul>
			<div class="post-content">
				<?php $this->content('- 阅读剩余部分 -'); ?>
			</div>
		</article>
	<?php endwhile; ?>

	<?php $this->pageNav('&laquo; 前一页', '后一页 &raquo;'); ?>
</div><!-- end #main-->

<?php $this->need('sidebar.php'); ?>
<?php $this->need('footer.php'); ?>