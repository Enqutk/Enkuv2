// Data management system for blogs and gallery
// Uses localStorage for persistence

const DataManager = {
  // Initialize data storage
  init() {
    if (!localStorage.getItem('blogs')) {
      localStorage.setItem('blogs', JSON.stringify([]));
    }
    if (!localStorage.getItem('gallery')) {
      localStorage.setItem('gallery', JSON.stringify([]));
    }
  },

  // Blog operations
  getBlogs() {
    const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    // Sort: featured first, then by date (newest first)
    return blogs.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date) - new Date(a.date);
    });
  },

  getBlog(id) {
    const blogs = this.getBlogs();
    return blogs.find(blog => blog.id === id);
  },

  addBlog(blogData) {
    const blogs = this.getBlogs();
    const newBlog = {
      id: Date.now().toString(),
      title: blogData.title,
      content: blogData.content,
      excerpt: blogData.excerpt || blogData.content.substring(0, 150) + '...',
      image: blogData.image || '',
      date: new Date().toISOString(),
      featured: blogData.featured || false,
      category: blogData.category || 'General'
    };
    blogs.unshift(newBlog); // Add to beginning
    localStorage.setItem('blogs', JSON.stringify(blogs));
    return newBlog;
  },

  updateBlog(id, blogData) {
    const blogs = this.getBlogs();
    const index = blogs.findIndex(blog => blog.id === id);
    if (index !== -1) {
      blogs[index] = { ...blogs[index], ...blogData };
      localStorage.setItem('blogs', JSON.stringify(blogs));
      return blogs[index];
    }
    return null;
  },

  deleteBlog(id) {
    const blogs = this.getBlogs();
    const filtered = blogs.filter(blog => blog.id !== id);
    localStorage.setItem('blogs', JSON.stringify(filtered));
    return filtered;
  },

  // Gallery operations
  getGallery() {
    const gallery = JSON.parse(localStorage.getItem('gallery') || '[]');
    // Sort by date (newest first)
    return gallery.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getGalleryItem(id) {
    const gallery = this.getGallery();
    return gallery.find(item => item.id === id);
  },

  addGalleryItem(itemData) {
    const gallery = this.getGallery();
    const newItem = {
      id: Date.now().toString(),
      title: itemData.title,
      description: itemData.description || '',
      image: itemData.image,
      date: new Date().toISOString(),
      category: itemData.category || 'General'
    };
    gallery.unshift(newItem); // Add to beginning
    localStorage.setItem('gallery', JSON.stringify(gallery));
    return newItem;
  },

  updateGalleryItem(id, itemData) {
    const gallery = this.getGallery();
    const index = gallery.findIndex(item => item.id === id);
    if (index !== -1) {
      gallery[index] = { ...gallery[index], ...itemData };
      localStorage.setItem('gallery', JSON.stringify(gallery));
      return gallery[index];
    }
    return null;
  },

  deleteGalleryItem(id) {
    const gallery = this.getGallery();
    const filtered = gallery.filter(item => item.id !== id);
    localStorage.setItem('gallery', JSON.stringify(filtered));
    return filtered;
  }
};

// Initialize on load
if (typeof window !== 'undefined') {
  DataManager.init();
}



