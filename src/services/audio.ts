export async function getCategories()
{
    const response = await fetch(`${import.meta.env.VITE_APP_HOST}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
}

export async function newCategory()
{
    let category = {
      name: "string",
      label: "string",
      color: "string",
      description: "string"
    }
    //send post to create category
}

export async function getAudioList(category)
{
    const url = category
        ? `${import.meta.env.VITE_APP_HOST}/audio/audio-list?category=${category}`
        : `${import.meta.env.VITE_APP_HOST}/audio/audio-list`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch audios');
    return await response.json();
}

export async function markAudio(name, category)
{
    let audioData = {
        name: name,
        category: category
    }
    try {
        // Make the POST request
        const response = await fetch(
          `${import.meta.env.VITE_APP_HOST}/audio/mark`,
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(audioData),
          }
        );

        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error marking audio:', error);
        // You could return null, an error object, or rethrow depending on your needs
        return null;
    }
}