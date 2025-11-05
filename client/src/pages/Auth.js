// src/pages/Auth.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { toast } from "react-toastify";

export default function Auth({ setToken }) {
  const [password, setPassword] = useState(false);
  // const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const res = isLogin
        ? await api.post("/login", values)
        : await api.post("/registration", values);

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      toast.success(isLogin ? "Вход выполнен" : "Регистрация успешна");
      navigate("/");
    } catch (error) {
      // const message = error.response.data.message;
      // setError(message);
      // toast.error('Ошибка при входе')
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: "#f0f2f5", fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-100" style={{ maxWidth: "40rem" }}>
        <div
          className="p-4 rounded-5 shadow"
          style={{ border: "1px solid black" }}
        >
          <h1 className="text-center mb-4">
            {isLogin ? "Вход" : "Регистрация"}
          </h1>

          {isLogin && (
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email("Некорректный email")
                  .required("Email обязателен"),
                password: Yup.string()
                  .min(3, "Минимум 3 символов")
                  .required("Пароль обязателен"),
              })}
              onSubmit={onSubmit}
            >
              {() => (
                <Form>
                  <div className="mb-3">
                    <label className="form-label fs-2 m-0">
                      Введите e-mail
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="form-control p-3 fs-5 rounded-4 border-secondary"
                      placeholder="name@example.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="mb-3 position-relative">
                    <label className="form-label fs-2 m-0">
                      Введите пароль
                    </label>
                    <Field
                      type={password ? "text" : "password"}
                      name="password"
                      className="form-control p-3 fs-5 rounded-4 border-secondary pe-5"
                      placeholder="password"
                    />
                    <i
                      className={`bi ${password ? "bi-eye-slash" : "bi-eye"}`}
                      onClick={() => setPassword(!password)}
                      style={{
                        position: "absolute",
                        right: "1rem",
                        top: "70%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#6c757d",
                        fontSize: "1.3rem",
                      }}
                    ></i>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`btn w-100 mb-4 fs-4 rounded-4 ${
                      isLogin ? "btn-primary" : "btn-success"
                    }`}
                  >
                    {loading
                      ? "Загрузка..."
                      : isLogin
                      ? "Войти"
                      : "Зарегистрироваться"}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          {!isLogin && (
            <Formik
              initialValues={{ email: "", password: "", role: "user" }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email("Некорректный email")
                  .required("Email обязателен"),
                password: Yup.string()
                  .min(3, "Минимум 3 символов")
                  .required("Пароль обязателен"),
                role: Yup.string()
                  .oneOf(["user", "admin"], "Выберите роль")
                  .required("Роль обязательна"),
              })}
              onSubmit={onSubmit}
            >
              {() => (
                <Form>
                  <div className="mb-3">
                    <label className="form-label fs-2 m-0">
                      Введите e-mail
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="form-control p-3 fs-5 rounded-4 border-secondary"
                      placeholder="name@example.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="mb-3 position-relative">
                    <label className="form-label fs-2 m-0">
                      Введите пароль
                    </label>
                    <Field
                      type={password ? "text" : "password"}
                      name="password"
                      className="form-control p-3 fs-5 rounded-4 border-secondary pe-5"
                      placeholder="password"
                    />
                    <i
                      className={`bi ${password ? "bi-eye-slash" : "bi-eye"}`}
                      onClick={() => setPassword(!password)}
                      style={{
                        position: "absolute",
                        right: "1rem",
                        top: "70%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#6c757d",
                        fontSize: "1.3rem",
                      }}
                    ></i>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fs-2 m-0">Роль</label>
                    <Field
                      as="select"
                      name="role"
                      className="form-control p-3 fs-5 rounded-4 border-secondary"
                    >
                      <option value="user">Пользователь</option>
                      <option value="admin">Администратор</option>
                    </Field>
                    <ErrorMessage
                      name="role"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 mb-4 fs-4 rounded-4 btn-success"
                    disabled={loading}
                  >
                    {loading ? "Загрузка..." : "Зарегистрироваться"}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          <p className="text-center">
            {isLogin ? (
              <>
                Нет аккаунта?{" "}
                <Link to="/register" className="text-decoration-none">
                  Зарегистрируйся
                </Link>
              </>
            ) : (
              <>
                Есть аккаунт?{" "}
                <Link to="/login" className="text-decoration-none">
                  Войти
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
