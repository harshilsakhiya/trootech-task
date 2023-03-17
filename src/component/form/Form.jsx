import React, { useEffect, useState } from "react";
import csc from "country-state-city";
import Select from "react-select";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addForm, updateData } from "../../Redux/formSlice.js";
import { useNavigate, useParams } from "react-router-dom";
import uuid from "react-uuid";

const initial = {
  name: "",
  password: "",
  mail: "",
  date: "",
  color: "#050505",
  address: "",
  age: "0",
};

export default function Form() {
  const dispatch = useDispatch();
  const getFormData = useSelector((state) => state.Data);


  const [input, setInput] = useState(initial);
  const [errors, setErrors] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(false);
  const [city, setCity] = useState({});
  const [state, setState] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const findDataById = getFormData.find((item) => item.id === id);
      setInput({
        name: findDataById.name,
        password: findDataById.password,
        mail: findDataById.mail,
        date: findDataById.date,
        color: findDataById.color,
        address: findDataById.address,
        age: findDataById.age,
      });
      setFile(findDataById.file);
      setStatus(findDataById.status);
      setCity(findDataById.city);
      setState(findDataById.state);
    }
  }, [id]);

  const updatedStates = (countryId) =>
    csc
      .getStatesOfCountry(countryId)
      .map((state) => ({ label: state.name, value: state.id, ...state }));

  const updatedCities = (stateId) =>
    csc
      .getCitiesOfState(stateId)
      .map((city) => ({ label: city.name, value: city.id, ...city }));

  const uploadfile = (e) => {
    let file = e.target.files[0];

    const size = (file.size / (1024 * 1024)).toFixed(2);

    if (size > 2) {
      toast.info("file size support up to 2mb!", { autoClose: 2000 });
    } else {
      const fileName = URL.createObjectURL(file);
      setFile(fileName);
    }
  };

  const changeevent = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
    if (event.target.name.trim()) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const submitForm = () => {
    if (validateForm()) {
      dispatch(
        addForm({
          id: uuid(),
          ...input,
          state: state,
          city: city,
          file: file,
          status: status,
        })
      );
      navigate("/");
    }
  };

  const updateForm = () => {
    if (validateForm()) {
      dispatch(
        updateData({
          id: id,
          ...input,
          state: state,
          city: city,
          file: file,
          status: status,
        })
      );
      navigate("/");
    }
  };

  const validateForm = () => {
    let formIsValid = true;
    let errors = {};
    if (input && !input.name) {
      formIsValid = false;
      errors["name"] = "*Please enter username!";
    }

    if (input && !input.password) {
      formIsValid = false;
      errors["password"] = "*Please enter password!";
    }

    if (input && !input.mail) {
      formIsValid = false;
      errors["mail"] = "*Please enter email!";
    } else if (
      input.mail &&
      !input.mail.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      formIsValid = false;
      errors["mail"] = "*Please enter vaild email id!";
    }

    if (input && !input.address) {
      formIsValid = false;
      errors["dob"] = "*Please enter address!";
    }

    if (!file) {
      formIsValid = false;
      errors["file"] = "*Please select you profile picture!";
    }
    setErrors(errors);
    return formIsValid;
  };


  return (
    <div>
      <div className="col-12 d-flex justify-content-center">
        <div className="m-3 col-5 ">
          <h1 className="text-center"> {id ? "Edit-Form" : "Create-Form"}</h1>
          <div className=" border p-3 ">
            <div>
              <lable for="name">name</lable>
              <input
                className="m-1 form-control"
                id="name"
                type="text"
                name="name"
                placeholder="enter your name"
                onChange={(e) => changeevent(e)}
                value={input.name}
              />
              <span className="text-danger"> {errors["name"]}</span>
            </div>
            <div>
              <label for="password">Password</label>
              <input
                className=" m-1 form-control"
                type="password"
                name="password"
                placeholder="password"
                onChange={(e) => changeevent(e)}
                value={input.password}
              />
              <span className="text-danger"> {errors["password"]}</span>
            </div>
            <div>
              <lable for="email">email </lable>
              <input
                className=" m-1 form-control"
                type="email"
                name="mail"
                placeholder="name123@gmail.com"
                onChange={(e) => changeevent(e)}
                value={input.mail}
              />
              <span className="text-danger"> {errors["mail"]}</span>
            </div>
            <div>
              <lable for="state">State </lable>
              <Select
                id="state"
                name="state"
                options={updatedStates("101")}
                value={state}
                onChange={(value) => {
                  setState(value)
                  setCity()
                }}
              />
            </div>
            <div>
              <lable for="state">City </lable>
              <Select
                id="city"
                name="city"
                options={updatedCities(state ? state.value : null)}
                value={city}
                onChange={(value) => setCity(value)}
              />
            </div>
            <div>
              <lable for="date">date</lable>
              <input
                className=" m-1 form-control"
                type="date"
                name="date"
                placeholder="date"
                onChange={(e) => changeevent(e)}
                value={input.date}
              />
            </div>
            <div>
              <label for="customRange1" className="form-label">
                Age({input.age})
              </label>
              <input
                type="range"
                className="form-range"
                name="age"
                id="customRange1"
                max={150}
                defaultValue="0"
                onChange={(e) => changeevent(e)}
                value={input.age}
              ></input>
            </div>
            <div>
              <label for="address"> Address</label>
              <textarea
                className="form-control"
                id="address"
                rows="3"
                name="address"
                onChange={(e) => changeevent(e)}
                maxlength="500"
                value={input.address}
              ></textarea>
              <span className="text-danger"> {errors["address"]}</span>
            </div>

            <div class="mb-3">
              <label for="formFileSm" className="form-label">
                profile picture
              </label>
              <input
                className="form-control form-control-sm"
                id="formFileSm"
                type="file"
                accept="image/*"
                onChange={(e) => uploadfile(e)}
              />
              <span className="text-danger"> {errors["file"]}</span>

              {file && <img src={file} className="col-3 m-2" alt="" />}
            </div>
            <div>
              <label for="exampleColorInput" class="form-label">
                Favourite Color
              </label>
              <input
                type="color"
                className="form-control form-control-color"
                id="exampleColorInput"
                title="Choose your color"
                name="color"
                onChange={(e) => changeevent(e)}
                value={input.color}
              ></input>
            </div>
            <div className="form-check form-switch ml-5">
              <label className="form-check-label" for="flexSwitchCheckChecked">
                Status
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                checked={status}
                id="flexSwitchCheckChecked"
                onChange={(e) => setStatus(e.target.checked)}
              />
            </div>
            {id ? (
              <div>
                <button className="btn btn-success mt-3" onClick={updateForm}>
                  update
                </button>
              </div>
            ) : (
              <div>
                <button className="btn btn-success mt-3" onClick={submitForm}>
                  submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
