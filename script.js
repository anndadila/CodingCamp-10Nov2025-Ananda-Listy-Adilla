// script.js

document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const dateInput = document.getElementById("date-input");
  const todoList = document.getElementById("todo-list");
  const filterStatus = document.getElementById("filter-status");

  let todos = []; // Array untuk menyimpan semua objek To-Do

  // 1. Fungsi untuk Memuat dan Menyimpan Data
  const loadTodos = () => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      todos = JSON.parse(storedTodos);
    }
    renderTodos();
  };

  const saveTodos = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  // 2. Fungsi untuk Render (Menampilkan) Daftar To-Do
  const renderTodos = () => {
    todoList.innerHTML = ""; // Kosongkan daftar saat ini
    const selectedFilter = filterStatus.value;

    // Terapkan filter
    const filteredTodos = todos.filter((todo) => {
      if (selectedFilter === "all") return true;
      if (selectedFilter === "completed") return todo.completed;
      if (selectedFilter === "pending") return !todo.completed;
      return true;
    });

    filteredTodos.forEach((todo) => {
      const listItem = document.createElement("li");
      listItem.className = `todo-item ${todo.completed ? "completed" : ""}`;
      listItem.dataset.id = todo.id;

      listItem.innerHTML = `
                <span class="todo-text">
                    ${todo.text}
                    <span class="date-display">Tenggat: ${todo.date}</span>
                </span>
                <div class="actions">
                    <button class="complete-btn" title="Tandai Selesai">
                        ${todo.completed ? "✔" : "☐"}
                    </button>
                    <button class="delete-btn" title="Hapus Tugas">🗑</button>
                </div>
            `;

      todoList.appendChild(listItem);
    });
  };

  // 3. Fungsi untuk Menambah To-Do (Add)
  const addTodo = (text, date) => {
    const newTodo = {
      id: Date.now(), // ID unik
      text: text,
      date: date,
      completed: false,
    };
    todos.push(newTodo);
    saveTodos();
    renderTodos();
  };

  // 4. Handler Submit Form (Termasuk Validasi Input)
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = todoInput.value.trim();
    const date = dateInput.value;

    // Validasi Input Form (2. Validate Input Form)
    if (text === "") {
      alert("Tugas tidak boleh kosong!");
      return;
    }

    if (date === "") {
      alert("Tanggal tenggat harus diisi!");
      return;
    }

    addTodo(text, date);
    todoInput.value = ""; // Reset input
    dateInput.value = ""; // Reset input tanggal
  });

  // 5. Fungsi untuk Menghapus dan Menandai Selesai (Delete dan Update Status)
  todoList.addEventListener("click", (e) => {
    const item = e.target.closest(".todo-item");
    if (!item) return;

    const id = parseInt(item.dataset.id);
    const todoIndex = todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) return;

    // Menghapus To-Do (Delete)
    if (e.target.classList.contains("delete-btn")) {
      if (confirm("Yakin ingin menghapus tugas ini?")) {
        todos.splice(todoIndex, 1);
        saveTodos();
        renderTodos();
      }
    }

    // Menandai Selesai (Toggle Status)
    if (e.target.classList.contains("complete-btn")) {
      todos[todoIndex].completed = !todos[todoIndex].completed;
      saveTodos();
      renderTodos();
    }
  });

  // 6. Handler Filter (Filter)
  filterStatus.addEventListener("change", renderTodos);

  // Muat data saat aplikasi pertama kali dimuat
  loadTodos();
});
