const tag_url = "http://localhost:5000/api/v1/tags";

export const fetchTags = async () => {
    try {
        const response = await fetch(api_url);
        if (!response.ok) {
            throw new Error("Not found")
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
    }
    };


const post_tagurl = "http://localhost:5000/api/v1/tags/";

export const addTag = async (tags) => {
try{
   const response = await fetch(post_url, {
    method: 'POST',
    header:{
       'Content-Type': 'application/json',
    },
    body: JSON.stringify(tags),
   });
   if (!response.ok){
    throw new Error('Not found')
   }
   const data = await response.json();
   return data;
}catch(error) {
    console.error('Error adding tags:', error);
    throw error;
}
}


const links_url = "localhost:5000/api/v1/bookmarks";

export const fetchLinks  = async () => {
    try {
        const response = await fetch(api_url);
        if (!response.ok) {
            throw new Error("Not found")
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error fetching links:', error);
        throw error;
    }
//tags
const tag_url = "http://localhost:5000/api/v1/tags";

export const fetchTags = async () => {
    try {
        const response = await fetch(tag_url);
        if (!response.ok) {
            throw new Error("Not found")
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
    }
    };


const post_tagurl = "http://localhost:5000/api/v1/tags/";

export const addTag = async (tags) => {
try{
   const response = await fetch(post_tagurl, {
    method: 'POST',
    headers:{
       'Content-Type': 'application/json',
    },
    body: JSON.stringify(tags),
   });
   if (!response.ok){
    throw new Error('Not found')
   }
   const data = await response.json();
   return data;
}catch(error) {
    console.error('Error adding tags:', error);
    throw error;
}
}


const update_tags = "http://localhost:5000/api/v1/tags/";

export const updateTags = async (id, updatedTag) => {
    try {
        const response = await fetch(update_tags, {
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



const delete_tags = "http://localhost:5000/api/v1/tags/";
export const deleteTags = async (id) => {
    try {
        const response = await fetch(delete_tags, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Not found');
        }
        return response.json();
    } catch (error) {
        console.error('Error deleting Tags:', error);
        throw error;
    }
};

//links

const links_url = "localhost:5000/api/v1/bookmarks";

export const fetchLinks  = async () => {
    try {
        const response = await fetch(links_url);
        if (!response.ok) {
            throw new Error("Not found")
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error fetching links:', error);
        throw error;
    }
    };



const post_linkurl = "http://localhost:5000/api/v1/bookmarks";

export const addLinks = async (links) => {
try{
   const response = await fetch(post_linkurl, {
    method: 'POST',
    header:{
       'Content-Type': 'application/json',
    },
    body: JSON.stringify(links),
   });
   if (!response.ok){
    throw new Error('Not found')
   }
   const data = await response.json();
   return data;
}catch(error) {
    console.error('Error adding links:', error);
    throw error;
}
}

const update_links = "http://localhost:5000/api/v1/bookmarks";
export const updateLink = async (id, updatedLink) => {
    try {
        const response = await fetch(update_links, {
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




const delete_links = "http://localhost:5000/api/v1/bookmarks";
export const deleteLink = async (id) => {
    try {
        const response = await fetch(delete_links, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Not found');
        }
        return response.json();
    } catch (error) {
        console.error('Error deleting Links:', error);
        throw error;
    }
};

//categories
const categories_url = "localhost:5000/api/v1/categories";

export const fetchCategories  = async () => {
    try {
        const response = await fetch(categories_url);
        if (!response.ok) {
            throw new Error("Not found")
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
    };



const post_categoriesurl = "http://localhost:5000/api/v1/categories";

export const addCategories = async (category) => {
try{
   const response = await fetch(post_categoriesurl, {
    method: 'POST',
    header:{
       'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
   });
   if (!response.ok){
    throw new Error('Not found')
   }
   const data = await response.json();
   return data;
}catch(error) {
    console.error('Error adding category:', error);
    throw error;
}
}

const update_Categories = "http://localhost:5000/api/v1/categories";
export const updateCategories = async (id, updatedCategories) => {
    try {
        const response = await fetch(update_Categories, {
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
        console.error('Error updating Categories:', error);
        throw error;
    }
};

const delete_categories = "http://localhost:5000/api/v1/categories";
export const deleteCartegoiries = async (id) => {
    try {
        const response = await fetch(delete_categories, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Not found');
        }
        return response.json();
    } catch (error) {
        console.error('Error deleting Categories:', error);
        throw error;
    }
};
    };    
