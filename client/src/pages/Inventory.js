import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { toast } from "react-toastify";

import { getUser } from "../utils/getUser";

export default function Inventory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState(null);
  const [currentUser, setCurrentUser] = useState({ id: null, role: "user" });

  const [fields, setFields] = useState({
      singleLine2: false,
      singleLine3: false,
      multiLine2: false,
      multiLine3: false,
      numeric2: false,
      numeric3: false,
      imageLink2: false,
      imageLink3: false,
      boolean2: false,
      boolean3: false,
  })

  // const [singleLine2, setSingleLine2] = useState(false);
  // const [singleLine3, setSingleLine3] = useState(false);
  // const [multiLine2, setMultiLine2] = useState(false);
  // const [multiLine3, setMultiLine3] = useState(false);
  // const [numeric2, setNumeric2] = useState(false);
  // const [numeric3, setNumeric3] = useState(false);
  // const [imageLink2, setImageLink2] = useState(false);
  // const [imageLink3, setImageLink3] = useState(false);
  // const [boolean2, setBoolean2] = useState(false);
  // const [boolean3, setBoolean3] = useState(false);

  const loadInventory = async () => {
    try {
      const res = await api.get(`/inventory/${id}`);
      setInventory(res.data);
    } catch (error) {
      toast.error(error.response.data.message);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async () => {
    try {
      const res = await api.get(`/items/${id}`);
      setItems(res.data);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // loadInventory, loadItems

  useEffect(() => {
    loadInventory();
    loadItems();
  }, [id]);

  useEffect(() => {
    const user = getUser();
    setCurrentUser(user);
  }, []);


  const addItem = async (values) => {
    const preparedValues = {
      ...values,
      numeric1: values.numeric1 === "" ? null : Number(values.numeric1),
      numeric2: values.numeric2 === "" ? null : Number(values.numeric2),
      numeric3: values.numeric3 === "" ? null : Number(values.numeric3),
      userId: currentUser.id,
    };

    try {
      const res = await api.post(`/items/${id}`, preparedValues);
      setItems([...items, res.data]);
      toast.success("Товар добавлен!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const updateItem = async (values) => {
    const preparedItem = {
      ...values,
      numeric1: values.numeric1 === "" ? null : Number(values.numeric1),
      numeric2: values.numeric2 === "" ? null : Number(values.numeric2),
      numeric3: values.numeric3 === "" ? null : Number(values.numeric3),
      userId: currentUser.id,
    };

    try {
      const res = await api.put(`/items/item/${selected.id}`, preparedItem);
      setItems((prev) =>
        prev.map((item) => (item.id === selected.id ? res.data : item))
      );
      toast.success("Товар обновлён!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Ошибка при обновлении");
    }
  };

  const closeModal = () => {
    setModal(false);
    setFields({
      singleLine2: false,
      singleLine3: false,
      multiLine2: false,
      multiLine3: false,
      numeric2: false,
      numeric3: false,
      imageLink2: false,
      imageLink3: false,
      boolean2: false,
      boolean3: false,
    })
    // setSingleLine2(false);
    // setSingleLine3(false);
    // setMultiLine2(false);
    // setMultiLine3(false);
    // setNumeric2(false);
    // setNumeric3(false);
    // setImageLink2(false);
    // setImageLink3(false);
    // setBoolean2(false);
    // setBoolean3(false);
    // setSelected(null);
    // setEdit(false);
  };

  const openEditModal = (item) => {
    setSelected(item);
    setEdit(true);
    setModal(true);

    setFields({
    singleLine2: !!item.singleLine2,
    singleLine3: !!item.singleLine3,
    multiLine2: !!item.multiLine2,
    multiLine3: !!item.multiLine3,
    numeric2: !!item.numeric2,
    numeric3: !!item.numeric3,
    imageLink2: !!item.imageLink2,
    imageLink3: !!item.imageLink3,
    boolean2: !!item.boolean2,
    boolean3: !!item.boolean3,
  })
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm("Удалить товар")) return;

    try {
      await api.delete(`/items/${id}/${itemId}`);
      setItems(items.filter((item) => item.id !== itemId));
      toast.success("Удалено");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!inventory) {
    return (
      <div className="text-center mt-5 text-secondary fs-2">
        {loading ? "Загрузка..." : " "}
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="bg-white p-4 rounded-4 shadow">
        <div className="d-flex justify-content-between ">
          <h1>{inventory.title}</h1>
          <div className="text-center">
            <Link to="/" className="btn btn-outline-secondary">
              Назад
            </Link>
          </div>
        </div>

        <div className="row my-4">
          <div className="col-md-6">
            <p>
              <strong>Описание:</strong>
            </p>
            <p>{inventory.description || "Без описания"}</p>
            <div className="col-md-6">
              <p>
                <strong>Категория: </strong>
                {inventory.category || "Без категории"}
              </p>
              <p>
                <strong>Публичный: </strong>
                {inventory.isPublic ? "Да" : "Нет"}
              </p>
              <p>
                <strong>Создан: </strong>
                {new Date(inventory.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h4>Товары в инвентаре</h4>
          {(inventory.isPublic ||
            (currentUser.id && inventory.userId === currentUser.id) ||
            (currentUser.id && currentUser.role === "admin")
          ) && (
            <button
              onClick={() => {
                setEdit(false);
                setSelected(null);
                setModal(true);
              }}
              className="btn btn-outline-success btn-lg"
            >
              Добавить товар
            </button>
          )}
        </div>

        <h4>Список товаров: {items.length}</h4>
        {items.length === 0 ? (
          <p>Товаров пока нет</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th scope="col"> Id</th>
                <th scope="col"> Название </th>
                <th scope="col"> Числовые значения </th>
                <th scope="col"> Ссылки на изображения </th>
                <th scope="col"> Флажки </th>
                <th scope="col"> Действия </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.customId || "-"}</td>
                  <td>
                    {item.singleLine1 && <div>1: {item.singleLine1}</div>}
                    {item.singleLine2 && <div>2: {item.singleLine2}</div>}
                    {item.singleLine3 && <div>3: {item.singleLine3}</div>}
                    {!item.singleLine1 &&
                      !item.singleLine2 &&
                      !item.singleLine3 &&
                      "-"}
                  </td>
                  <td>
                    {item.numeric1 && <div>1: {item.numeric1}$</div>}
                    {item.numeric2 && <div>2: {item.numeric2}$</div>}
                    {item.numeric3 && <div>3: {item.numeric3}$</div>}
                    {!item.numeric1 && !item.numeric2 && !item.numeric3 && "-"}
                  </td>
                  <td>
                    <div className="d-flex gap-1 flex-wrap">
                      {item.imageLink1 && (
                        <a href={item.imageLink1}>
                          <p>Пока нет</p>
                        </a>
                      )}
                      {item.imageLink2 && (
                        <a href={item.imageLink2}>
                          <p>Пока нет</p>
                        </a>
                      )}
                      {item.imageLink3 && (
                        <a href={item.imageLink3}>
                          <p>Пока нет</p>
                        </a>
                      )}
                      {!item.imageLink1 &&
                        !item.imageLink2 &&
                        !item.imageLink3 &&
                        "-"}
                    </div>
                  </td>
                  <td>
                    {item.boolean1 === true && (
                      <div>{item.boolean1 ? "В наличии" : "Нет"}</div>
                    )}
                    {item.boolean2 === true && (
                      <div>
                        {item.boolean2 ? "Нет в наличии" : "Есть в наличии"}
                      </div>
                    )}
                    {item.boolean3 === true && (
                      <div>{item.boolean3 ? "Покупка" : "Обмен"}</div>
                    )}
                    {item.boolean1 === null &&
                      item.boolean2 === null &&
                      item.boolean3 === null &&
                      "-"}
                  </td>
                  <td>
                    {(currentUser.role === "admin" ||
                      item.userId === currentUser.id) && (
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="btn btn-outline-primary p-2"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="btn btn-outline-danger p-2">
                          Удалить
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {modal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Добавить товар</h5>
                  <button onClick={closeModal} className="btn-close"></button>
                </div>

                <Formik
                  initialValues={{
                    singleLine1: selected?.singleLine1 ?? "",
                    singleLine2: selected?.singleLine2 ?? "",
                    singleLine3: selected?.singleLine3 ?? "",
                    multiLine1: selected?.multiLine1 ?? "",
                    multiLine2: selected?.multiLine2 ?? "",
                    multiLine3: selected?.multiLine3 ?? "",
                    numeric1: selected?.numeric1 ?? "",
                    numeric2: selected?.numeric2 ?? "",
                    numeric3: selected?.numeric3 ?? "",
                    imageLink1: selected?.imageLink1 ?? "",
                    imageLink2: selected?.imageLink2 ?? "",
                    imageLink3: selected?.imageLink3 ?? "",
                    boolean1: selected?.boolean1 ?? false,
                    boolean2: selected?.boolean2 ?? false,
                    boolean3: selected?.boolean3 ?? false,
                  }}
                  validationSchema={Yup.object({
                    singleLine1: Yup.string().min(3, "Минимум 3 символов"),
                    singleLine2: Yup.string().min(3, "Минимум 3 символов"),
                    singleLine3: Yup.string().min(3, "Минимум 3 символов"),
                    multiLine1: Yup.string().min(3, "Минимум 3 символов"),
                    multiLine2: Yup.string().min(3, "Минимум 3 символов"),
                    multiLine3: Yup.string().min(3, "Минимум 3 символов"),
                    numeric1: Yup.number(),
                    numeric2: Yup.number(),
                    numeric3: Yup.number(),
                    imageLink1: Yup.string().min(3, "Минимум 3 символов"),
                    imageLink2: Yup.string().min(3, "Минимум 3 символов"),
                    imageLink3: Yup.string().min(3, "Минимум 3 символов"),
                    boolean1: Yup.boolean(),
                    boolean2: Yup.boolean(),
                    boolean3: Yup.boolean(),
                  })}
                  onSubmit={async (values, { resetForm }) => {
                    try {
                      if (edit) {
                        await updateItem(values);
                      } else {
                        await addItem(values);
                      }
                      resetForm();
                      closeModal();
                    } catch (error) {
                      toast.error("Ошибка при сохранении");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <Form>
                    <div className="modal-body">
                      <div className="column g-2">
                        <div>
                          <label>SingleLine1 (Название)</label>
                          <Field
                            type="text"
                            name="singleLine1"
                            className="form-control rounded-4 p-2"
                            placeholder="Iphone"
                          />
                          {!fields.singleLine2 && (
                            <button
                              type="button"
                              onClick={
                                () => setFields(prev => ({ ...prev, singleLine2: true }))
                              }
                              className="btn btn-sm btn-outline-secondary rounded-4 mt-2 w-100"
                            >
                              + Добавить singleLine2
                            </button>
                          )}
                        </div>
                        {fields.singleLine2 && (
                          <div>
                            <label>SingleLine2 (Производитель)</label>
                            <Field
                              name="singleLine2"
                              className="form-control rounded-4"
                              placeholder="Apple"
                            />
                            {!fields.singleLine3 && (
                              <button
                                type="button"
                                onClick={
                                  () => setFields(prev => ({ ...prev, singleLine3: true }))
                                }
                                className="btn btn-sm btn-outline-secondary mt-2 w-100 rounded-4"
                              >
                                + Добавить singleLine3
                              </button>
                            )}
                          </div>
                        )}

                        {fields.singleLine3 && (
                          <div>
                            <label>SingleLine3 (Модель)</label>
                            <Field
                              name="singleLine3"
                              className="form-control rounded-4"
                              placeholder="Pro Max"
                            />
                          </div>
                        )}
                      </div>

                      <hr className="my-3" />
                      <h5 className="mb-3">Описание</h5>
                      <div className="column g-2">
                        <div>
                          <label>MultiLine1</label>
                          <Field
                            as="textarea"
                            name="multiLine1"
                            className="form-control rounded-4 p-2"
                            placeholder="Полное описание..."
                          />

                          {!fields.multiLine2 && (
                            <button
                              type="button"
                              onClick={
                                () => setFields(prev => ({ ...prev, multiLine2: true }))
                              }
                              className="btn btn-sm btn-outline-secondary mt-2 w-100 rounded-4"
                            >
                              + Добавить multiLine2
                            </button>
                          )}
                        </div>
                        {fields.multiLine2 && (
                          <div>
                            <label>MultiLine2</label>
                            <Field
                              as="textarea"
                              name="multiLine2"
                              className="form-control rounded-4 p-2"
                              placeholder="Дополнительно..."
                            />
                            {!fields.multiLine3 && (
                              <button
                                type="button"
                                onClick={
                                  () => setFields(prev => ({ ...prev, multiLine3: true }))
                                }
                                className="btn btn-sm btn-outline-secondary mt-2 w-100 rounded-4"
                              >
                                + Добавить multiLine3
                              </button>
                            )}
                          </div>
                        )}

                        {fields.multiLine3 && (
                          <div>
                            <label>MultiLine3</label>
                            <Field
                              as="textarea"
                              name="multiLine3"
                              className="form-control rounded-4 p-2"
                              placeholder="Примечание..."
                            />
                          </div>
                        )}
                      </div>

                      <hr className="my-3" />
                      <h6 className="mb-3">Числовые значения</h6>
                      <div className="column g-3 mb-3">
                        <div>
                          <label>Numeric1</label>
                          <Field
                            type="number"
                            name="numeric1"
                            className="form-control rounded-4"
                            placeholder="1200"
                          />
                          <ErrorMessage
                            name="numeric1"
                            component="div"
                            className="text-danger small"
                          />

                          {!fields.numeric2 && (
                            <button
                              type="button"
                              onClick={
                                () => setFields(prev => ({ ...prev, numeric2: true }))
                              }
                              className="btn btn-sm btn-outline-secondary mt-2 w-100 rounded-4"
                            >
                              + Добавить numeric2
                            </button>
                          )}
                        </div>

                        {fields.numeric2 && (
                          <div>
                            <label>Numeric2</label>
                            <Field
                              type="number"
                              name="numeric2"
                              className="form-control rounded-4"
                              placeholder="5"
                            />
                            <ErrorMessage
                              name="numeric2"
                              component="div"
                              className="text-danger small"
                            />

                            {!fields.numeric3 && (
                              <button
                                type="button"
                                onClick={
                                  () => setFields(prev => ({ ...prev, numeric3: true }))
                                }
                                className="btn btn-sm btn-outline-secondary mt-2 w-100 rounded-4"
                              >
                                + Добавить numeric3
                              </button>
                            )}
                          </div>
                        )}

                        {fields.numeric3 && (
                          <div>
                            <label>Numeric3</label>
                            <Field
                              type="number"
                              name="numeric3"
                              className="form-control rounded-4"
                              placeholder="0"
                            />
                            <ErrorMessage
                              name="numeric3"
                              component="div"
                              className="text-danger small"
                            />
                          </div>
                        )}
                      </div>

                      <hr className="my-3" />
                      <h5 className="mb-3">Ссылки на изображения</h5>
                      <div className="column g-2">
                        <div>
                          <label>ImageLink1</label>
                          <Field
                            name="imageLink1"
                            className="form-control rounded-4 p-2"
                            placeholder="https://..."
                          />

                          {!fields.imageLink2 && (
                            <button
                              type="button"
                              onClick={
                                () => setFields(prev => ({ ...prev, imageLink2: true }))
                              }
                              className="btn btn-sm btn-outline-secondary mt-2 w-100 rounded-4"
                            >
                              + Добавить imageLink2
                            </button>
                          )}
                        </div>
                        {fields.imageLink2 && (
                          <div>
                            <label>ImageLink2</label>
                            <Field
                              name="imageLink2"
                              className="form-control rounded-4 p-2"
                              placeholder="https://..."
                            />
                            {!fields.imageLink3 && (
                              <button
                                type="button"
                                onClick={
                                  () => setFields(prev => ({ ...prev, imageLink3: true }))
                                }
                                className="btn btn-sm btn-outline-secondary mt-2 w-100 rounded-4"
                              >
                                + Добавить imageLink3
                              </button>
                            )}
                          </div>
                        )}

                        {fields.imageLink3 && (
                          <div>
                            <label>ImageLink3</label>
                            <Field
                              name="imageLink3"
                              className="form-control rounded-4 p-2"
                              placeholder="https://..."
                            />
                          </div>
                        )}
                      </div>

                      <hr className="my-3" />
                      <div className="column g-2">
                        <div>
                          <div className="form-check">
                            <Field
                              type="checkbox"
                              name="boolean1"
                              className="form-check-input"
                            />
                            <label className="form-check-label">
                              В наличии
                            </label>
                          </div>
                          {!fields.boolean2 && (
                            <button
                              type="button"
                              onClick={
                                () => setFields(prev => ({ ...prev, boolean2: true }))
                              }
                              className="btn btn-sm btn-outline-secondary mt-2 w-100 rounded-4"
                            >
                              + Добавить boolean2
                            </button>
                          )}
                        </div>
                        {fields.boolean2 && (
                          <div>
                            <div className="form-check">
                              <Field
                                type="checkbox"
                                name="boolean2"
                                className="form-check-input"
                                id="bool2"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="bool2"
                              >
                                Нет в наличии
                              </label>
                            </div>
                            {!fields.boolean3 && (
                              <button
                                type="button"
                                onClick={
                                  () => setFields(prev => ({ ...prev, boolean3: true }))
                                }
                                className="btn btn-sm btn-outline-secondary mt-2 w-100 rounded-4"
                              >
                                + Добавить boolean3
                              </button>
                            )}
                          </div>
                        )}
                        {fields.boolean3 && (
                          <div>
                            <div className="form-check">
                              <Field
                                type="checkbox"
                                name="boolean3"
                                className="form-check-input"
                                id="bool3"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="bool3"
                              >
                                Закуп
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
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
                        className="btn btn-success rounded-4" >
                        {loading
                          ? edit ? "Сохраняю..." : "Добавляю..."
                          : edit ? "Сохранить" : "Добавить"
                        }
                      </button>
                    </div>
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
