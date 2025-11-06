import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { toast } from "react-toastify";

import { getUser } from "../utils/getUser";

export default function Home() {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: null, role: "user" });
  const [token, setToken] = useState(localStorage.getItem("token"));

  const navigate = useNavigate();

  // useEffect(() => {
  //   loadInventories();
  // }, []);

  useEffect(() => {
    loadInventories();
    const user = getUser();
    setCurrentUser(user);
  }, [token]);

  const loadInventories = async () => {
    try {
      const res = await api.get("/inventory");
      setInventories(res.data);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const createInventory = async (values) => {
    setLoading(true);
    try {
      const res = await api.post("/inventory", {
        title: values.title,
        description: values.description,
        category: values.category,
        isPublic: values.isPublic,
        version: 1,
        imageUrl: null,
        tags: [],
        customIdFormat: null,
      });
      setInventories([...inventories, res.data]);
      setModal(false);
      toast.success("Инвентарь создан");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      toast.success("Вы вышли из аккаунта");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const deleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо!"
    );
    if (!confirmDelete) return;
    try {
      await api.delete("/delete");
      localStorage.removeItem("token");
      toast.success("Вы удалили свой аккаунт");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const exitAdmin = async () => {
    try {
      const res = await api.post("/exit-admin");
      localStorage.setItem("token", res.data.token);
      toast.success("Вы вышли из режима админа");
      setToken(res.data.token);
    } catch (error) {
      toast.error("Ошибка выхода из админа");
    }
  };

  const deleteInventory = async (id) => {
    const confirmDelete = window.confirm(
      "Вы действительно хотите удалить этот аккаунт?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/inventory/${id}`);
      setInventories(inventories.filter((inv) => inv.id !== id));
      toast.success("Инвентарь удалён");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f0f2f5" }}>
      <div className="bg-white">
        <div className="container p-4">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="m-0">Мои инвентари</h1>
            <div className="d-flex gap-3">
              <button
                onClick={logout}
                className="btn btn-outline-dark btn-lg fs-5 rounded-4 px-4">
                Выйти
              </button>
              {currentUser.role === "admin" && (
                <button
                  onClick={exitAdmin}
                  className="btn btn-outline-warning btn-lg fs-5 rounded-4 px-4">
                  Выйти из админа
                </button>
              )}
              <button
                onClick={deleteAccount}
                className="btn btn-outline-danger btn-lg fs-5 rounded-4 px-4">
                Удалить аккаунт
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-3">
        <div className="text-end">
          <button
            onClick={() => setModal(true)}
            className="btn btn-outline-success btn-lg fs-5 mx-2">
            Создать
          </button>
        </div>

        <div className="row g-3">
          {inventories.map((item) => (
            <div className="col-md-6 col-lg-4" key={item.id}>
              <div className="card h-100 shadow rounded-4 overflow-hidden m-2">
                <h5 className="card-title m-2">{item.title}</h5>
                <p className="card-text m-2">
                  {item.description || "Без описания"}
                </p>
                <div className="m-2">
                  <Link
                    className="btn btn-outline-info w-100"
                    to={`/inventory/${item.id}`}>
                    Открыть
                  </Link>
                </div>
                {currentUser.role === "admin" && (
                  <button
                    className="btn btn-outline-danger m-2"
                    onClick={() => deleteInventory(item.id)}>
                    Удалить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content rounded-4 shadow ">
              <div className="modal-header d-flex flex-column">
                <button
                  onClick={() => setModal(false)}
                  className="btn btn-close"
                ></button>
                <h5>Создание инвентаря</h5>
              </div>
              <Formik
                initialValues={{
                  title: "",
                  description: "",
                  category: "",
                  isPublic: false,
                }}
                validationSchema={Yup.object({
                  title: Yup.string()
                    .min(3, "Минимум 3 символов")
                    .required("Название обязательно"),
                  description: Yup.string()
                    .min(3, "Минимум 3 символов")
                    .required("Описание обязательно"),
                  category: Yup.string()
                    .min(3, "Минимум 3 символов")
                    .required("Категория обязательно"),
                  isPublic: Yup.boolean(),
                })}
                onSubmit={(values) => createInventory(values)}
              >
                <Form>
                  <div className="modal-body ">
                    <label>Название инвентаря</label>
                    <Field
                      type="text"
                      name="title"
                      className="form-control rounded-4 p-2"
                      placeholder="Введите название"/>
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-danger small"/>

                    <div className="mb-3">
                      <label>Описание</label>
                      <Field
                        as="textarea"
                        name="description"
                        className="form-control rounded-4 p-2"
                        placeholder="Введите описание"/>
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-danger small"/>
                    </div>

                    <div className="mb-3">
                      <label>Категория</label>
                      <Field
                        type="text"
                        name="category"
                        className="form-control rounded-4 p-2"
                        placeholder="Категория (например, Склад)"/>
                      <ErrorMessage
                        name="category"
                        component="div"
                        className="text-danger small"/>
                    </div>

                    <div className="form-check">
                      <label className="form-check-label border-none">
                        Публичный инвентарь
                      </label>
                      <Field
                        type="checkbox"
                        name="isPublic"
                        className="form-check-input"
                        style={{ cursor: "pointer" }}/>
                      <ErrorMessage
                        name="isPublic"
                        component="div"
                        className="text-danger small"/>                
                    </div>

                    <div className="modal-footer d-flex justify-content-between">
                      <button
                        type="button"
                        onClick={() => setModal(false)}
                        className="btn btn-secondary rounded-4">
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success rounded-4">
                        {loading ? "Создаю..." : "Создать"}
                      </button>
                    </div>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
