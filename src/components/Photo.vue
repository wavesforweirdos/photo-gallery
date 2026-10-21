<template>
    <div ref="box" class="image-box" role="dialog" aria-modal="true" aria-label="Photo detail" tabindex="-1"
        @click.self="closeImagebox" @keydown.esc="closeImagebox">
        <div class="image-dialog">
        <div class="image-content">
            <p v-if="error" class="image-error" role="alert">{{ error }}</p>
            <img v-else-if="photoURL" :src="photoURL" :alt="description">
            <div class="image-info">
                <p class="image-description" v-if="description">{{ description }}</p>
                <p class="image-city" v-if="city">{{ city }}</p>
                <p class="image-username" v-if="user">
                    Photo by
                    <a :href="userUrl" target="_blank" rel="noopener">{{ user.name || '@' + user.username }}</a>
                    on
                    <a :href="unsplashUrl" target="_blank" rel="noopener">Unsplash</a>
                </p>
            </div>
        </div>
        <button ref="close" type="button" class="image-close" aria-label="Close photo" @click="closeImagebox">✕</button>
        </div>
    </div>
</template>

<script>
import { unsplashGet, errorMessage, userUrl, UNSPLASH_URL } from '../unsplash'

export default {
    name: 'PhotoComponent',
    data() {
        return {
            user: null,
            photoURL: '',
            description: '',
            city: '',
            error: '',
            unsplashUrl: UNSPLASH_URL,
        }
    },
    computed: {
        userUrl() {
            return userUrl(this.user)
        },
    },
    methods: {
        async fetchPhoto() {
            try {
                const json = await unsplashGet(`/photos/${this.$route.params.id}`)
                this.photoURL = json.urls.regular
                this.user = json.user
                const text = json.description || json.alt_description || ''
                this.description = text ? text[0].toUpperCase() + text.slice(1) : ''
                this.city = json.location?.name || ''
            } catch (err) {
                this.error = errorMessage(err)
            }
        },
        closeImagebox() {
            this.$router.push({ path: '/', query: this.$route.query })
        },
    },
    created() {
        this.fetchPhoto()
    },
    mounted() {
        // Move focus into the dialog so keyboard users land on the close button and Esc works right away
        this.$refs.close.focus()
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
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow-y: auto;
    padding: 2rem 1rem;
    box-sizing: border-box;
}

/* The card is as wide as the photo, so the caption matches its width */
.image-dialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 100%;
    margin: auto 0;
}

.image-content {
    display: flex;
    flex-direction: column;
    width: fit-content;
    max-width: 100%;
}

.image-content img {
    display: block;
    width: auto;
    max-width: 100%;
    max-height: 70vh;
}

.image-info {
    background-color: #FFFFFF;
    text-align: center;
    padding: 1.5rem 2rem;
    width: 0;
    min-width: 100%;
    box-sizing: border-box;
}

.image-close {
    flex: none;
    width: 3rem;
    height: 3rem;
    margin-top: 1rem;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background-color: #FFFFFF;
    color: #111111;
    font: inherit;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
}

.image-close:hover {
    background-color: #DDDDDD;
}

/* The page's dark focus ring would vanish on the dark overlay */
.image-close:focus-visible {
    outline: 3px solid #FFFFFF;
    outline-offset: 3px;
}

.image-error {
    background-color: #FFFFFF;
    padding: 2rem;
    text-align: center;
}

.image-box:focus {
    outline: none;
}

.image-username{
    font-size: small;
}
.image-city{
    font-weight:600;
    font-size: small;
}
</style>
