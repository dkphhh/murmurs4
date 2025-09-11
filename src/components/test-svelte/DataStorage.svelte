<script lang="ts">
  import { onMount } from "svelte";

  function setCookie(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    document.cookie =
      encodeURIComponent("test_cookie") + "=" + encodeURIComponent(value);
  }

  function setLocalStorage(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    localStorage.setItem("test_local_storage", JSON.stringify({ value }));
  }

  let db: IDBDatabase;

  let CreateBookField: {
    title: string;
    author: string;
    price: number | null;
    createBook: () => void;
  } = $state({
    title: "",
    author: "",
    price: null,
    createBook() {
      if (!db) {
        console.error("Database is not initialized");
        return;
      }

      let transaction = db.transaction(["books"], "readwrite");

      transaction.oncomplete = function () {
        console.log("All done!");
      };

      transaction.onerror = function () {
        console.error("Transaction error:", transaction.error);
      };

      let bookObjectStore = transaction.objectStore("books");

      let book = {
        title: this.title,
        author: this.author,
        price: this.price,
      };

      let request = bookObjectStore.add(book);

      request.onsuccess = function () {
        console.log("Book added to the store:", request.result);
      };
      request.onerror = function () {
        console.error("Error", request.error);
      };

      this.title = "";
      this.author = "";
      this.price = null;
    },
  });

  let GetBookField: {
    title: string;
    author: string;
    price: number | null;
    getTheBook: () => void;
  } = $state({
    title: "",
    author: "",
    price: null,
    getTheBook() {
      if (!db) {
        console.error("Database is not initialized");
        return;
      }

      const transaction = db.transaction(["books"], "readonly");

      transaction.oncomplete = function () {
        console.log("All done!");
      };

      transaction.onerror = function () {
        console.error("Transaction error:", transaction.error);
      };

      const bookObjectStore = transaction.objectStore("books");

      const titleIndex = bookObjectStore.index("title");

      const request = titleIndex.getAll(this.title);

      request.onsuccess = function () {
        if (request.result) {
          console.log("Book found:", request.result);

          const idList = request.result.map((book) => book.id);
          idList.forEach((id) => bookObjectStore.delete(id));
        } else {
          console.log("No book found with the given title");
        }
      };
      request.onerror = function () {
        console.error("Error", request.error);
      };
    },
  });

  onMount(() => {
    window.onstorage = (event) => {
      if (event.key === "test_local_storage") {
        console.log("Local storage changed:", event.newValue);
      }
    };

    let openRequest = indexedDB.open("localDB", 2);

    openRequest.onupgradeneeded = function (event) {
      // 现有的数据库版本小于 2（或不存在）
      db = openRequest.result;

      switch (
        event.oldVersion // 现有的 db 版本
      ) {
        case 0:
          console.log("Creating new database");
          db.createObjectStore("books", { keyPath: "id", autoIncrement: true });
        case 1:
          console.log("Upgrading to version 2");
          const bookStore = openRequest.transaction?.objectStore("books");
          if (!bookStore) {
            console.error("Object store 'books' not found");
            return;
          }
          bookStore.createIndex("title", "title", { unique: false });
          break;
      }
    };

    openRequest.onerror = function () {
      console.error("Error", openRequest.error);
    };
    openRequest.onsuccess = function () {
      db = openRequest.result;
      db.addEventListener("versionchange", () => {
        db.close();
        alert("A new version of this page is ready. Please reload!");
      });
      db.addEventListener("blocked", () => {
        db.close();
        alert("A new version of this page is ready. Please reload!");
      });
      console.log("Database opened successfully");
    };
  });
</script>

<div class="flex">
  <fieldset class="fieldset">
    <legend class="fieldset-legend">Pick a file</legend>
    <input type="text" class="input" id="setCookie" onchange={setCookie} />
    <label for="setCookie" class="label">set cookie</label>
  </fieldset>

  <fieldset class="fieldset">
    <legend class="fieldset-legend">Pick a file</legend>
    <input
      type="text"
      class="input"
      id="setLocalStorage"
      onchange={setLocalStorage}
    />
    <label for="setLocalStorage" class="label">set local storage</label>
  </fieldset>
</div>

<div class="flex gap-4">
  <fieldset
    class="fieldset w-xs rounded-box border border-base-300 bg-base-200 p-4"
  >
    <legend class="fieldset-legend">Create Book</legend>

    <label for="Book Title" class="label">Title</label>
    <input
      type="text"
      class="input"
      placeholder="Book Title"
      id="Book Title"
      bind:value={CreateBookField.title}
    />

    <label for="Book author" class="label">Author</label>
    <input
      type="text"
      class="input"
      placeholder="Book author"
      id="Book author"
      bind:value={CreateBookField.author}
    />

    <label for="Book price" class="label">Price</label>
    <input
      type="number"
      class="input"
      placeholder="Book price"
      id="Book price"
      bind:value={CreateBookField.price}
    />
    <button
      class="btn"
      type="button"
      onclick={() => CreateBookField.createBook()}>Create</button
    >
  </fieldset>

  <fieldset
    class="fieldset w-xs rounded-box border border-base-300 bg-base-200 p-4"
  >
    <legend class="fieldset-legend">Get Book</legend>

    <label for="The Book Title" class="label">Title</label>
    <input
      type="text"
      class="input"
      placeholder="Book Title"
      id="The Book Title"
      bind:value={GetBookField.title}
    />

    <label for="The Book author" class="label">Author</label>
    <input
      type="text"
      class="input"
      placeholder="Book author"
      id="The Book author"
      bind:value={GetBookField.author}
    />

    <label for="The Book price" class="label">Price</label>
    <input
      type="number"
      class="input"
      placeholder="Book price"
      id="The Book price"
      bind:value={GetBookField.price}
    />
    <button class="btn" type="button" onclick={() => GetBookField.getTheBook()}
      >Get</button
    >
  </fieldset>
</div>
