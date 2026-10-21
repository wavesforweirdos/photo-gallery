<template>
    <div class="image-box" @click.self="closeImagebox">
        <div class="image-content">
            <img :src="photoURL">
            <div class="image-info">
                <p class="image-description" v-if="description">{{ description }}</p>
                <p class="image-city" v-if="city">{{ city }}</p>
                <p class="image-username" v-if="user">
                    <a rel="nofollow" :href="user.portfolio_url">
                        @{{ user.username }}
                    </a>
                </p>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'PhotoComponent',
    methods: {
        fetchPhoto() {
            fetch(this.url + this.$route.params.id + '/?&client_id=' + this.accesKey)
                .then(response => response.json())
                .then((json) => {
                    this.photoURL = json.urls.regular
                    this.user = json.user

                    if (!json.description && !json.alt_description) {
                        this.description = ''
                    } else if (json.description) {
                        this.description = json.description[0].toUpperCase() + json.description.slice(1)
                    } else {
                        this.description = json.alt_description[0].toUpperCase() + json.alt_description.slice(1)
                    }

                    if (json.location && json.location.name) {
                        this.city = json.location.name
                    }

                }).catch((err) => {
                    console.error('Could not load photo', err)
                })
        },
        closeImagebox() {
            this.$router.push({ path: '/', query: this.$route.query })
        },
    },
    created() {
        this.fetchPhoto();
    },
    data() {
        return {
            user: '',
            photoURL: '',
            description: '',
            city: '',
            accesKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
            url: 'https://api.unsplash.com/photos/',
        }
    },
}
</script>

<style>
.image-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: grid;
    grid-template-columns: repeat(4, 25% [col-start]);
    overflow-y: auto;
}
.image-content{
    grid-column: 2 / span 2;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    align-self: start;
    margin: 2rem 0;
}

.image-content img {
    display: block;
    width: 100%;
    max-height: 75vh;
    object-fit: contain;
    background-color: #000000;
}

@media (max-width: 768px) {
    .image-content {
        grid-column: 1 / span 4;
        margin: 0;
    }
}

.image-info {
    background-color: #FFFFFF;
    text-align: center;
    padding: 2rem;
}

.image-username{
    font-size: small;
}
.image-city{
    font-weight:600;
    font-size: small;
}
</style>
