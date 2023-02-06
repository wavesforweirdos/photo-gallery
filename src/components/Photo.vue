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
                    console.log(json)
                    this.photoURL = json.urls.full
                    this.user = json.user

                    if (!json.description && !json.alt_description) {
                        this.description = ''
                    } else if (json.description) {
                        this.description = json.description[0].toUpperCase() + json.description.slice(1)
                    } else {
                        this.description = json.alt_description[0].toUpperCase() + json.alt_description.slice(1)
                    }

                    if (json.location.name) {
                        this.city = json.location.name
                    }

                }).catch((err) => {
                    console.log('error', err)
                })
        },
        closeImagebox() {
            this.$router.push('/');
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
            accesKey: '-hmPsUWIESwXL5s88SIL1UjmeC2U-hdlZ9rOWDKnzHY',
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
}
.image-content{
    grid-column: 2 / span 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
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
