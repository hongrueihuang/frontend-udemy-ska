<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Loading from "../components/Loading.vue";
const codeRef = ref([]);
const codes = ref(["", "", "", ""]);
const isLoading = ref(false);
const isValid = ref(true);
const router = useRouter();

onMounted(() => {
	codeRef.value[0].focus();
});

async function handleInput(e, i) {
	const value = e.target.value;
	isValid.value = true;
	if (isNaN(value)) {
		e.target.value = "";
		return;
	}
	if (value.length > 1) {
		e.target.value = value[0];
	}
	if (value) {
		codes.value[i - 1] = value;
		if (i < 4) {
			codeRef.value[i].focus();
		} else {
			handleSubmit();
		}
	}
}

function handleDelete(i) {
	if (i > 1) {
		codeRef.value[i - 2].focus();
	}
	codes.value[i - 1] = "";
}

function handlePaste(e) {
	e.preventDefault();
	const paste = (e.clipboardData || window.clipboardData).getData("text");
	if (paste.length === 4) {
		for (let i = 0; i < 4; i++) {
			codes.value[i] = paste[i];
			codeRef.value[i].value = paste[i];
			handleSubmit();
		}
	}
}

async function handleSubmit() {
	isLoading.value = true;
	try {
		await fetch("http://localhost:3000/api/verify/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ code: codes.value.join("") }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.valid) {
					localStorage.setItem("token", data.token);
					router.push("/profile");
					return;
				}
				isValid.value = false;
			});
	} catch (error) {
		console.error(error);
	}
	isLoading.value = false;
}
</script>

<template>
	<div class="wrapper">
		<Loading v-if="isLoading" />
		<h2>Please enter verification code.</h2>
		<form>
			<div class="form-group">
				<input
					v-for="i in 4"
					:model-value="codes[i]"
					:ref="(el) => codeRef.push(el)"
					type="text"
					maxlength="1"
					@input="(e) => handleInput(e, i)"
					@keyup.delete="handleDelete(i)"
					@paste="(e) => handlePaste(e)"
				/>
			</div>
		</form>
		<p v-if="!isValid" style="color: red">Wrong Code!</p>
	</div>
</template>

<style scoped>
.wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100vh;
}

.form-group {
	display: flex;
	justify-content: space-between;
	width: 200px;
}

.form-group input {
	width: 40px;
	height: 40px;
	text-align: center;
}
</style>
