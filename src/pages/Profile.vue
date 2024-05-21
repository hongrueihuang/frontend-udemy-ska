<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

const user = ref(null);
const router = useRouter();

onBeforeMount(() => {
    getUser();
});

async function getUser() {
	const data = await fetch("http://localhost:3000/api/profile", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: localStorage.getItem("token"),
		},
	});
	if (data.status === 401) {
		router.push("/");
		return;
	}
	const response = await data.json();
	user.value = response;
}

function handleLogout() {
	localStorage.removeItem("token");
	router.push("/");
}
</script>

<template>
	<div class="wrapper">
		<div class="user">
			<div class="user__avatar">
				<img :src="user?.photo" alt="avatar" />
			</div>
			<div class="user__info">
				<h2>{{ user?.name }}</h2>
				<p>{{ user?.quote }}</p>
			</div>
		</div>
		<button class="btn-logout" type="button" @click="handleLogout">Logout</button>
	</div>
</template>

<style scoped>
.wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	flex-direction: column;
}

.user {
	display: flex;
	align-items: center;
	flex-direction: column;
	box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
	max-width: 360px;
	margin-bottom: 20px;
}

.user__avatar {
	width: 100%;
	height: 200px;
	overflow: hidden;
}

.user__avatar img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.user__info {
	padding: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.btn-logout {
	padding: 10px 20px;
	background-color: #f44336;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
}
</style>
