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
    };    
