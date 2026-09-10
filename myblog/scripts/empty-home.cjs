'use strict';

hexo.extend.generator.register('empty-home-and-archive', function emptyHomeAndArchiveGenerator(locals) {
  if (locals.posts.length > 0) return [];

  const posts = locals.posts.sort(this.config.index_generator.order_by || '-date');

  return [
    {
      path: 'index.html',
      layout: this.config.index_generator.layout || ['index', 'archive'],
      data: {
        __index: true,
        base: '',
        total: 1,
        current: 1,
        current_url: '',
        posts,
        prev: 0,
        prev_link: '',
        next: 0,
        next_link: ''
      }
    },
    {
      path: `${this.config.archive_dir || 'archives'}/index.html`,
      layout: ['archive', 'index'],
      data: {
        archive: true,
        base: this.config.archive_dir || 'archives',
        total: 1,
        current: 1,
        current_url: this.config.archive_dir || 'archives',
        posts,
        prev: 0,
        prev_link: '',
        next: 0,
        next_link: ''
      }
    }
  ];
});
