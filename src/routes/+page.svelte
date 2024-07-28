<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './dark-mode-toggle.svelte'
	let image: File | null = null;
	let imageUrl: string | null = null;
	let question: string = '';
	let isDragging: boolean = true;
	let description: string | null = null;
	let isLoading: boolean = false;

	const MAX_WIDTH = 1000;
	const MAX_HEIGHT = 1000;

	const resizeImage = (file: File): Promise<File> => {
		return new Promise((resolve) => {
			const img = new Image();
			img.src = URL.createObjectURL(file);
			img.onload = () => {
				const canvas = document.createElement('canvas');
				let width = img.width;
				let height = img.height;

				if (width > height) {
					if (width > MAX_WIDTH) {
						height = Math.round((height * MAX_WIDTH) / width);
						width = MAX_WIDTH;
					}
				} else {
					if (height > MAX_HEIGHT) {
						width = Math.round((width * MAX_HEIGHT) / height);
						height = MAX_HEIGHT;
					}
				}

				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0, width, height);

				canvas.toBlob((blob) => {
					if (blob) {
						resolve(new File([blob], file.name, { type: file.type }));
					}
				}, file.type);
			};
		});
	};

	const handleFileUpload = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			image = target.files[0];
			image = await resizeImage(image);
			imageUrl = URL.createObjectURL(image);
		}
	};

	const handleDrop = async (event: DragEvent) => {
		event.preventDefault();
		isDragging = true;
		if (event.dataTransfer && event.dataTransfer.files.length > 0) {
			image = event.dataTransfer.files[0];
			image = await resizeImage(image);
			imageUrl = URL.createObjectURL(image);
		}
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		isDragging = true;
	};

	const handleDragLeave = () => {
		isDragging = false;
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			document.getElementById('file-input')?.click();
		}
	};

	const submitForm = async () => {
		if (!image || !question) {
			alert("1. Drag a photo 👉 HERE 👈 to UPLOAD\nMirror, mirror, on the wall,\nwho's the fairest of them all?\n2. Ask your question 👉 HERE 👈, e.g. Why?\n3. Message my AI bot 👉 CLICK HERE 👈\n4. Please send me your 🫵 LinkedIn connection request and message me there\n5. Scroll up & Click ✊🏿 🌚 🙌🏿 at ☝️ top 👆\n6. Scroll down & Click ✊ 🌝 🙌 at 👇 bottom 👇");
			return;
		}

		isLoading = true;
		const formData = new FormData();
		formData.append('image', image);
		formData.append('question', question);

		try {
			const response = await fetch('/api/ask', {
				method: 'POST',
				body: formData
			});
			type Result = {
				description: string;
			};
			const result: Result = await response.json();
			description = result.description; // Store the description from the response
		} catch (error) {
			console.error('Error submitting form:', error);
			description = 'An error occurred while processing your request.';
		} finally {
			isLoading = false;
		}
	};
</script>

<svelte:head>
    <title>lloyd-in-san-francisco.pages.dev</title>
</svelte:head>

<div class="container">
	<h1><center>
	<p style="color:DarkGray;">👋 Hello, World! 🗺️
	<br>
	<a href="https://www.linkedin.com/in/lloydchang/">Lloyd | c | San Francisco UTC-7</a>
	<br></p>
	<Button>✊🏿 🌚 🙌🏿</Button>
	<br>
	<iframe src="
	https://lloyd-in-san-francisco.pages.dev/
	"
	width="140"
	height="100"
	title="👋 Hello"
	>
	</iframe>
	</center></h1>
	<div
		class="upload-area {isDragging ? 'dragging' : ''}"
		role="button"
		tabindex="0"
		on:drop={handleDrop}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:click={() => document.getElementById('file-input')?.click()}
		on:keydown={handleKeyDown}
		aria-label="Upload Area: 1. Upload image"
	>
		<input
			type="file"
			accept="image/*"
			on:change={handleFileUpload}
			style="display: none;"
			id="file-input"
		/>
		{#if imageUrl}
			<img src={imageUrl} alt="Upload preview" />
		{:else}
			<label for="file-input">1. DRAG a photo 👉 HERE 👈 to UPLOAD</label>
		{/if}
	</div>
	<h1><center>Mirror, mirror, on the wall,<br>who's the fairest of them all?</center></h1>
	<textarea
		type="text"
		class="question-input"
		placeholder="2. Ask your question 👉 HERE 👈, e.g. Why?"
		bind:value={question}
	/>
	<button class="submit-button" on:click={submitForm}>3. Message my AI bot 👉 CLICK HERE 👈</button>
	{#if isLoading}
		<div class="loading-indicator">Please wait… ⏳</div>
	{/if}
	{#if description}
		<div class="description">{description}</div>
	{/if}
	<h1><center>
	<p style="color:DarkGray;">
	4. Please send me
	<br>
	<a href="https://www.linkedin.com/in/lloydchang/">
	your 🫵 LinkedIn connection request
	</a>
	<br>
	and message me there
	<br>
	<enhanced:img src="../lib/images/QR code for www.linkedin.com in lloydchang.jpg" alt="QR code for www.linkedin.com in lloydchang.jpg"/>
	<br>
	<br>
	5. Scroll up & Click ✊🏿 🌚 🙌🏿 at ☝️ top 👆
	<br>
	<br>
	6. Scroll down & Click ✊ 🌝 🙌 at 👇 bottom 👇</p>

</center></h1>
	<div class="footer">
		<h1>
		<hr>
		<p style="color:DarkGray;">Headstarter Fellowship</p>
		<hr>
		<br>
		<a href="https://lloyd-in-san-francisco.pages.dev/">Project 1: Personal Website</a>
		<br>
		<enhanced:img src="../lib/images/Project 1 - Personal Website.jpg" alt="Project 1 - Personal Website.jpg"/>
		<br>
		<p style="color:DarkGray;">✅ Mention AI resources<br>✅ Being an AI Engineer</p>
		<br>
		<br>
		<p style="color:DarkGray;">I attended</p>
		<br>
		<a href="https://www.ai.engineer/worldsfair">AI Engineer World's Fair</a>
		<br>
		<p style="color:DarkGray;">and</p>
		<a href="https://www.ai.engineer/summit/2023">AI Engineer Summit</a>
		<br>
		<enhanced:img src="../lib/images/Lloyd at AI Engineer World's Fair.jpg" alt="Lloyd at AI Engineer World's Fair.jpg"/>
		<enhanced:img src="../lib/images/Lloyd at AI Engineer Summit.jpg" alt="Lloyd at AI Engineer Summit.jpg"/>
		<br>
		<br>
		<hr>
		<a href="https://discord.com/channels/958775364962889859/1265400160993935480/1266600782590120107">Worldwide 🌎 🌍 🌏 In Real Life</a>
		<hr>
		<enhanced:img src="../lib/images/Lloyd.jpg" alt="Lloyd.jpg"/>
		<enhanced:img src="../lib/images/lloyd-in-san-francisco.jpg" alt="lloyd-in-san-francisco.jpg"/>
		<br>
		<enhanced:img src="../lib/images/2024 Organize an in-person meetup.jpg" alt="2024 Organize an in-person meetup.jpg"/>
		<enhanced:img src="../lib/images/irl-san-francisco Meetup Places.jpg" alt="irl-san-francisco Meetup Places.jpg"/>
		<br>
		<br>
		<hr>
		<p style="color:DarkGray;">Lloyd's AI bot — Sample screenshots</p>
		<hr>
		<enhanced:img src="../lib/images/dark mode Yasin Ehsan.jpg" alt="dark mode Yasin Ehsan.jpg"/>
		<enhanced:img src="../lib/images/light mode Yasin Ehsan.jpg" alt="light mode Yasin Ehsan.jpg"/>
		<br>
		<br>
		<hr>
		<p style="color:DarkGray;">Take care; thank you!</p>
		<br>
		<a href="https://www.linkedin.com/in/lloydchang/">Lloyd | c | San Francisco UTC-7</a>
		<br>
		<Button>✊ 🌝 🙌</Button>
		</h1>
		<p style="color:DarkGray;">© 2024 Lloyd Chang</p>
</div>
</div>

<style>
	:global(body) {
		background-color: black;
		color: #0084f6;
		transition: background-color 0.3s
	}
	:global(body.dark-mode) {
		background-color: white;
		color: #bfc2c7;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-left: 30px;
		margin-top: 0px;
	}

	h1 {
		color: #0070f3;
	}

	.upload-area {
		width: 460px;
		height: 460px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 0px;
		transition: background-color 0.3s;
		cursor: pointer;
		font-size: 64px;
		border-radius: 25% / 50%;
	}

	.upload-area.dragging {
		background-color: #e0e0e0;
	}

	.upload-area img {
		max-width: 100%;
		max-height: 100%;
		display: block;
	}

	.question-input {
		width: 460px;
		padding: 15px;
		margin-bottom: 0px;
		font-size: 36px;
		margin-bottom: 0px;
	}

	.submit-button {
		padding: 15px 30px;
		background-color: #0070f3;
		color: white;
		border: none;
		border-radius: 50% 20% / 10% 40%;
		cursor: pointer;
		font-size: 32px;
		margin-left: 30px;
		margin-top: 0px;
		margin-bottom: 0px;
	}

	.submit-button:hover {
		margin-left: 30px;
		margin-top: 0px;
		background-color: #005bb5;
		margin-bottom: 0px;
	}

	.loading-indicator {
		margin-left: 30px;
		margin-top: 0px;
		font-size: 64px;
		color: #0070f3;
		margin-bottom: 0px;
	}

	.description {
		margin-left: 30px;
		margin-top: 0px;
		font-size: 48px;
		font-weight: bold;
		padding: 0px;
		border: 0px solid #0070f3;
		border-radius: 0px;
		background-color: #e0f7fa;
		color: #0070f3;
		max-width: 100%;
		text-align: center;
		margin-bottom: 0px;
		width: 1000px;
	}

	.footer {
		margin-left: 30px;
		margin-top: 0px;
		text-align: center;
		font-size: 12px;
		color: #555;
	}

	.footer p {
		margin-left: 30px;
		margin: 0px 0;
		display: inline;
		margin-bottom: 0px;
	}

	.footer a {
		margin-left: 30px;
		color: #0070f3;
		text-decoration: none;
		margin-bottom: 0px;
	}

	.footer a:hover {
		text-decoration: underline;
	}
</style>
