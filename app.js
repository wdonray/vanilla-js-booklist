// Book Class: a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: Handle UI Tasks
class UI {
  // Display stored books
  static displayBooks() {
    const books = Storage.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  // Add new book
  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${book.title}</td> 
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href='#' class='btn btn-outline-danger btn-sm delete'>X</a></td>
    `;

    list.appendChild(row);
  }

  // Clear input fields
  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  // Remove target element
  static deleteBook(target) {
    if (target.classList.contains("delete")) {
      target.parentElement.parentElement.remove();
    }
  }

  // Show alert
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
}

// Store Class: Handles Storage
class Storage {
  static getBooks() {
    let books;

    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBook(book) {
    const books = Storage.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Storage.getBooks();

    books.forEach((book, id) => {
      if (book.isbn === isbn) {
        books.splice(id, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", (event) => {
  // Prevent submit
  event.preventDefault();
  // Get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // Validate
  if (title.trim() === "" || author.trim() === "" || isbn.trim() === "") {
    UI.showAlert("Oh Snap! Change a few things up and try again.", "danger");
    return;
  }

  // Create a book
  const book = new Book(title, author, isbn);

  // Add book to UI
  UI.addBookToList(book);

  // Add book to Storage
  Storage.addBook(book);

  // Show success message
  UI.showAlert(`Book Added: ${title}`, "success");

  // Clear fields
  UI.clearFields();
});

// Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
  UI.deleteBook(e.target);

  const title =
    e.target.parentElement.parentElement.firstElementChild.textContent;

  const isbn = e.target.parentElement.previousElementSibling.textContent;

  UI.showAlert(`Book Removed: ${title}`, "danger");

  Storage.removeBook(isbn);
});
