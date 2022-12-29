"use strict";
let num;
const navbar = document.querySelector(".navbar");
const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const email = document.getElementById("email");
const imageurl = document.getElementById("imageurl");
let newfirstname = document.getElementById("newfirstname");
let newlastname = document.getElementById("newlastname");
let newemail = document.getElementById("newemail");
let newimageurl = document.getElementById("newimageurl");
let users_data = [];
const listUsers = async function (num) {
  const URL = `https://reqres.in/api/users?page=${num}`;
  const res = await fetch(URL);
  const dataUsers = await res.json();
  let { data } = dataUsers;
  data.forEach((user) => users_data.push(user));
};

const html =
  "<div class='d-flex align-items-center justify-content-center flex-wrap text-center users_container mb-5'></div>";
navbar.insertAdjacentHTML("afterend", html);
const container = document.querySelector(".users_container");
const createCard = function (user) {
  const card = `
    <div class='card ms-3 me-3 mt-5' style='width: 10rem' data-id=${user.id}>
        <img src=${user.avatar} class='card-img-top' />
        <div class='card-body'>
            <h5 class='card-title'>${user.first_name} ${user.last_name}</h5>
            <p class='card-text'>${user.email}</p>
            <div class="buttons d-flex align-items-center justify-content-between card_icons">
                <img src=${"images/trash-solid.svg"} class="bin">
                <img src=${"images/pen-to-square-solid.svg"} class="edit">
            </div>
        </div>
    </div>`;
  container.insertAdjacentHTML("beforeend", card);
};
const call = async function () {
  await listUsers(1);
  await listUsers(2);
  users_data.forEach((u) => createCard(u));
  const bin = document.querySelectorAll(".bin");
  bin.forEach((ele) => ele.addEventListener("click", delUser));
  const edit = document.querySelectorAll(".edit");
  edit.forEach((ele) => ele.addEventListener("click", editUser));
};
call();
let postData = async () => {
  try {
    const myAddModalEl = document.getElementById("addUserModal");
    const modal = bootstrap.Modal.getInstance(myAddModalEl);
    modal.hide();
    let res = await fetch("https://reqres.in/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstname.value,
        last_name: lastname.value,
        email: email.value,
        avatar: imageurl.value,
      }),
    });
    let data = await res.json();
    users_data.push(data);
    container.innerHTML = "";
    users_data.forEach((u) => createCard(u));
    const bin = document.querySelectorAll(".bin");
    bin.forEach((ele) => ele.addEventListener("click", delUser));
    const edit = document.querySelectorAll(".edit");
    edit.forEach((ele) => ele.addEventListener("click", editUser));
  } catch (err) {}
};
const save = document.querySelector(".saveUser");
save.addEventListener("click", postData);

const delUser = function (e) {
  const myDelModalEl = new bootstrap.Modal(
    document.getElementById("deleteUserModal")
  );
  myDelModalEl.show();
  const yes = document.querySelector(".yes");
  yes.addEventListener("click", async function () {
    const parent = e.target.closest(".card");
    const id = parent.dataset.id;

    const URL = `https://reqres.in/api/users/${id}`;
    const myDelModalEl = document.getElementById("deleteUserModal");
    const modal = bootstrap.Modal.getInstance(myDelModalEl);
    modal.hide();
    const res = await fetch(URL, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!res.ok) return;

    for (let i in users_data) {
      if (users_data[i].id == id) {
        users_data.splice(i, 1);
      }
    }

    container.innerHTML = "";
    users_data.forEach((u) => createCard(u));
    const bin = document.querySelectorAll(".bin");
    bin.forEach((ele) => ele.addEventListener("click", delUser));
    const edit = document.querySelectorAll(".edit");
    edit.forEach((ele) => ele.addEventListener("click", editUser));
  });
};
const editUser = function (e) {
  const myEditModalEl = new bootstrap.Modal(
    document.getElementById("editUserModal")
  );
  myEditModalEl.show();
  const parent = e.target.closest(".card");
  const id = parent.dataset.id;
  const target = users_data.find((elem) => elem.id == id);

  newfirstname.value = target.first_name;
  newlastname.value = target.last_name;
  newemail.value = target.email;
  newimageurl.value = target.avatar;
  const editU = document.querySelector(".editUser");
  editU.addEventListener(
    "click",
    async function () {
      const myEditModalEl = document.getElementById("editUserModal");
      const modal = bootstrap.Modal.getInstance(myEditModalEl);
      modal.hide();

      let res = await fetch(`https://reqres.in/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: newfirstname.value,
          last_name: newlastname.value,
          email: newemail.value,
          avatar: newimageurl.value,
        }),
      });
      let data = await res.json();

      if (!res.ok) return;
      for (let i in users_data) {
        if (users_data[i].id == id) {
          users_data[i].first_name = data.first_name;
          users_data[i].last_name = data.last_name;
          users_data[i].email = data.email;
          users_data[i].avatar = data.avatar;
        }
      }
      container.innerHTML = "";
      users_data.forEach((u) => createCard(u));
      const bin = document.querySelectorAll(".bin");
      bin.forEach((ele) => ele.addEventListener("click", delUser));
      const edit = document.querySelectorAll(".edit");
      edit.forEach((ele) => ele.addEventListener("click", editUser));
    },
    { once: true }
  );
};
