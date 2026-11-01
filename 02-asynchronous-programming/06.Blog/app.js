
function attachEvents() {
    const loadPostsBtn = document.getElementById('btnLoadPosts');
    const viewPostBtn = document.getElementById('btnViewPost');

    const postsSelect = document.getElementById('posts');
    const postTitle = document.getElementById('post-title');
    const postBody = document.getElementById('post-body');
    const postComments = document.getElementById('post-comments');

    const postsUrl = 'http://localhost:3030/jsonstore/blog/posts';
    const commentsUrl = 'http://localhost:3030/jsonstore/blog/comments';

    loadPostsBtn.addEventListener('click', loadPosts);
    viewPostBtn.addEventListener('click', viewPost);

    async function loadPosts() {
        const response = await fetch(postsUrl);
        const data = await response.json();

        postsSelect.innerHTML = '';

        Object.values(data).forEach(post => {
            const option = document.createElement('option');

            option.value = post.id;
            option.textContent = post.title;

            postsSelect.appendChild(option);
        });
    }

    async function viewPost() {
        const selectedPostId = postsSelect.value;

        const [postsResponse, commentsResponse] = await Promise.all([
            fetch(postsUrl),
            fetch(commentsUrl)
        ]);

        const posts = await postsResponse.json();
        const comments = await commentsResponse.json();

        const selectedPost = posts[selectedPostId];

        if (!selectedPost) {
            return;
        }

        postTitle.textContent = selectedPost.title;
        postBody.textContent = selectedPost.body;

        postComments.innerHTML = '';

        Object.values(comments)
            .filter(comment => comment.postId === selectedPostId)
            .forEach(comment => {
                const li = document.createElement('li');
                li.textContent = comment.text;

                postComments.appendChild(li);
            });
    }
}

attachEvents();
