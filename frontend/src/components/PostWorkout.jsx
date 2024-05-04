import { useState, useEffect } from "react";
import { Modal, Select, MenuItem, Button, InputLabel, FormControl, Grid, Typography, TextField  } from "@mui/material";
import { DateTime } from "luxon";
import { authStore } from "../stores/auth_store/Store";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function PostWorkout(){
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [selectedDateObj, setSelectedDateObj] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [imgData, setImgData] = useState(null);
  const [checkedInDates, setCheckedInDates] = useState([]);
  const [dates, setDates] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [exercise, setExercise] = useState("");

  const {token} = authStore((state) => state)

  useEffect(() => {
    getWeek();
  }, []);

  const getWeek = () => {
    const dates = [];
    let today = DateTime.now();
    let from_date = today.startOf('week');
    let to_date = today.endOf('week');

    while (from_date <= to_date) {
      dates.push(from_date.toFormat("MM/dd/yyyy"));
      from_date = from_date.plus({ days: 1 });
    }

    setDates(dates);

    axios.get(`${API_URL}/workouts/workout/`, {
      params: {
        dateOne: DateTime.fromISO(dates[0]).toISODate(),
        dateTwo: DateTime.fromISO(dates[6]).toISODate(),
      },
      headers: {
        Authorization: `Token ${token}`,
      },
    }).then((response) => {
      const checkedDates = response.data.workout.map(obj => obj.date);
      setCheckedInDates(checkedDates);
    });
  };

  const placeDates = () => {
    const cutoffDate = DateTime.local().minus({ days: 3 });
    const today = DateTime.local();

    return dates.map((date) => {
      const formattedDate = DateTime.fromFormat(date, "MM/dd/yyyy");

      if (checkedInDates.includes(formattedDate.toFormat("YYYY-MM-DD"))) {
        return (
          <div onClick={() => handleOpenModal(date)}  key={date}>
            <div>{formattedDate.toFormat("EEE")}</div>
            <div>{formattedDate.toFormat("dd")}</div>
          </div>
        );
      } else if (formattedDate < cutoffDate || formattedDate > today) {
        return (
          <div key={date}>
            <div>{formattedDate.toFormat("EEE")}</div>
            <div>{formattedDate.toFormat("dd")}</div>
          </div>
        );
      } else if (formattedDate.hasSame(today, 'day')) {
        return (
          <div onClick={() => handleOpenModal(date)} key={date}>
            <div>{formattedDate.toFormat("EEE")}</div>
            <div>{formattedDate.toFormat("dd")}</div>
          </div>
        );
      } else {
        return (
          <div onClick={() => handleOpenModal(date)} key={date}>
            <div>{formattedDate.toFormat("EEE")}</div>
            <div>{formattedDate.toFormat("dd")}</div>
          </div>
        );
      }
    });
  };

  const handleOpenModal = (num) => {
    let selectedDate = [];
    if (dates.includes(num)) {
      if (selectedDateObj) {
        selectedDateObj.map((obj) => {
          if (obj.date === DateTime.fromFormat(num, "MM/dd/yyyy").toFormat("yyyy-MM-dd")) {
            selectedDate.push(obj);
          }
        });
      }
    }
    setShowModal(true);
    setModalDate(num);
    setSelectedDateObj(selectedDate[0]);
  };

  const handleClosedModal = () => {
    setShowModal(false);
    setHours(0);
    setMinutes(0);
    setImgData(null);
    setImgPreview(null);
    setModalDate(null);
    setExercise(null);
  };

  const handleChange = (event) => {
    if (event.target.name === "picture") {
      setImgPreview(URL.createObjectURL(event.target.files[0]));
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => setImgData(reader.result);
    } else {
      switch (event.target.name) {
        case "hours":
          setHours(event.target.value);
          break;
        case "minutes":
          setMinutes(event.target.value);
          break;
        case "exercise":
          setExercise(event.target.value);
          break;
        default:
          break;
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setButtonDisabled(true);

    axios.post(
      `${API_URL}/workouts/workout/`,
      {
        imgData: imgData,
        date: DateTime.fromFormat(modalDate, "MM/dd/yyyy").toFormat("yyyy-MM-dd"),
        duration: `${hours}:${minutes}`,
        exercise: exercise,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    ).then((response) => {
      if (response.data.workout) {
        setSelectedDateObj(response.data.workout);
        getWeek();
      }
    });
  };

  return (
    <div>
      {placeDates()}
      <Modal   
        open={showModal}
        onClose={handleClosedModal}
      >
        <form onSubmit={handleSubmit} style={{background: 'white'}}>
          <div>
            <Typography variant="h6">{modalDate}</Typography>
            <Button onClick={handleClosedModal}>x</Button>
          </div>
          {selectedDateObj ? (
            <div>
              <div>
                <Typography variant="body1">{selectedDateObj.workoutLength}</Typography>
                <Typography variant="body1">{selectedDateObj.exercise}</Typography>
              </div>
              <div>
                <div>
                  <img id="progress-image" src={selectedDateObj.picture} alt="" />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="hours">Hours</InputLabel>
                      <Select
                        value={hours}
                        onChange={handleChange}
                        name="hours"
                        id="hours"
                        required
                      >
                        {[...Array(13).keys()].map(hour =>
                          <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="minutes">Minutes</InputLabel>
                      <Select
                        value={minutes}
                        onChange={handleChange}
                        name="minutes"
                        id="minutes"
                        required
                      >
                        {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(minute =>
                          <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="exercise">Exercise</InputLabel>
                      <TextField
                        value={exercise}
                        onChange={handleChange}
                        name="exercise"
                        id="exercise"
                        required
                      >
                        
                      </TextField>
                    </FormControl>
                  </Grid>
                </Grid>
                <div>
                  <label htmlFor="workout-image-input">
                    Upload photo...
                  </label>
                  <input
                    id="workout-image-input"
                    type="file"
                    name="picture"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  <div>
                    <img src={imgPreview} alt="" />
                  </div>
                </div>
              </div>
              <div>
                <Button type="submit" disabled={buttonDisabled}>Submit</Button>
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}
