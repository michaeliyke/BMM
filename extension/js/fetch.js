const base_url = "http://localhost:5000/api/v1";
const tag_url = `${base_url}/tags`;
const post_tagurl = `${base_url}/tags/`;
const update_tags = `${base_url}/tags/`;
const delete_tags = `${base_url}/tags/`;
const links_url = `${base_url}/bookmarks`;
const post_linkurl = `${base_url}/bookmarks`;
const update_links = `${base_url}/bookmarks`;
const delete_links = `${base_url}/bookmarks`;
const categories_url = `${base_url}/categories`;
const post_categoriesurl = `${base_url}/categories`;
const update_Categories = `${base_url}/categories`;
const delete_categories = `${base_url}/categories`;

export const fetchTags = async () => {
  try {
    const response = await fetch(tag_url);
    if (!response.ok) {
      throw new Error("Not found");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

export const addTag = async (tags) => {
  try {
    const response = await fetch(post_tagurl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tags),
    });
    if (!response.ok) {
      throw new Error('Not found');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding tags:', error);
    throw error;
  }
};

export const updateTags = async (id, updatedTag) => {
  try {
    const response = await fetch(`${update_tags}${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTag),
    });
    if (!response.ok) {
      throw new Error('Not found');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating tags:', error);
    throw error;
  }
};

export const deleteTags = async (id) => {
  try {
    const response = await fetch(`${delete_tags}${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Not found');
    }
    return response.json();
  } catch (error) {
    console.error('Error deleting tags:', error);
    throw error;
  }
};

export const fetchLinks = async () => {
  try {
    const response = await fetch(links_url);
    if (!response.ok) {
      throw new Error("Not found");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching links:', error);
    throw error;
  }
};

export const addLink = async (link) => {
  try {
    const response = await fetch(post_linkurl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(link),
    });
    if (!response.ok) {
      throw new Error('Not found');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding links:', error);
    throw error;
  }
};

export const updateLink = async (id, updatedLink) => {
  try {
    const response = await fetch(`${update_links}${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedLink),
    });
    if (!response.ok) {
      throw new Error('Not found');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating link:', error);
    throw error;
  }
};

export const deleteLink = async (id) => {
  try {
    const response = await fetch(`${delete_links}${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Not found');
    }
    return response.json();
  } catch (error) {
    console.error('Error deleting links:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(categories_url);
    if (!response.ok) {
      throw new Error("Not found");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const addCategories = async (category) => {
  try {
    const response = await fetch(post_categoriesurl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error('Not found');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const updateCategories = async (id, updatedCategories) => {
  try {
    const response = await fetch(`${update_Categories}${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCategories),
    });
    if (!response.ok) {
      throw new Error('Not found');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating categories:', error);
    throw error;
  }
};

export const deleteCategories = async (id) => {
  try {
    const response = await fetch(`${delete_categories}${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Not found');
    }
    return response.json();
  } catch (error) {
    console.error('Error deleting categories:', error);
    throw error;
  }
};
