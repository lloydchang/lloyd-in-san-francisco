<script>
    function toggle() {
        window.document.body.classList.toggle('dark-mode')
    }
    </script>
    <button on:click={toggle}>
        <slot/>
    </button>
    <style>
        button {
            background-color: black;
            border-radius: 100%;
            border: none;
            color: black;
            font-size: 64px;
            padding: 0rem;
        }
        :global(body.dark-mode) button {
            background-color: white;
            border-radius: 100%;
            border: none;
            color: white;
            font-size: 64px;
            padding: 0rem;
        }
    </style>