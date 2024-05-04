import { useState, useEffect } from "react";
import { Modal, Select, MenuItem, Button, InputLabel, FormControl, Grid, Typography, Box } from "@mui/material";
import { DateTime } from "luxon";
import { authStore } from "../stores/auth_store/Store";
import Axios from "axios";

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
  const [workoutType, setWorkoutType] = useState("");

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

    Axios.get("http://127.0.0.1:8000/workouts/workout/", {
      params: {
        dateOne: DateTime.fromISO(dates[0]).toISODate(),
        dateTwo: DateTime.fromISO(dates[6]).toISODate(),
      },
      headers: {
        Authorization: `Token ${token}`,
      },
    }).then((response) => {
      const checkedDates = response.data.checkIn.map(obj => obj.date);
      setCheckedInDates(checkedDates);
    });
  };

  const placeDates = () => {
    const cutoffDate = DateTime.local().minus({ days: 3 });
    const today = DateTime.local();

    return dates.map((date) => {
      const formattedDate = DateTime.fromFormat(date, "MM/dd/yyyy");

      if (checkedInDates.includes(formattedDate.toFormat("yyyy-MM-dd"))) {
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
    setWorkoutType(null);
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
        case "workoutType":
          setWorkoutType(event.target.value);
          break;
        default:
          break;
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setButtonDisabled(true);

    Axios.post(
      "http://127.0.0.1:8000/api/checkIn/",
      {
        imgData: imgData,
        date: DateTime.fromFormat(modalDate, "MM/dd/yyyy").toFormat("yyyy-MM-dd"),
        workoutDuration: `${hours}:${minutes}`,
        workoutType: workoutType,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    ).then((response) => {
      if (response.data.checkIn) {
        setSelectedDateObj(response.data.checkIn);
        getWeek();
      }
    });
  };

  return (
    <div>
      {placeDates()}
      <Modal   
        overlayClassName="Overlay"
        open={showModal}
        onClose={handleClosedModal}
      >
        <Box onSubmit={handleSubmit} sx={{background: 'white'}}>
          <div>
            <Typography variant="h6">{modalDate}</Typography>
            <Button onClick={handleClosedModal}>x</Button>
          </div>
          {selectedDateObj ? (
            <div>
              <div>
                <Typography variant="body1">{selectedDateObj.workoutLength}</Typography>
                <Typography variant="body1">{selectedDateObj.workoutType}</Typography>
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
                      <InputLabel htmlFor="workoutType">Workout Type</InputLabel>
                      <Select
                        value={workoutType}
                        onChange={handleChange}
                        name="workoutType"
                        id="workoutType"
                        required
                      >
                        {["Weights", "Cardio", "Swimming", "Running", "Cycling", "Sports", "Soccer", "Volleyball", "Golf", "Hunting", "Hiking", "HIIT", "Calisthenics", "Yoga", "Crossfit", "Basketball", "Disc golf", "Racquetball", "Football"].map(type =>
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <div>
                  <label htmlFor="workout-image-input">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17">
                      <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
                    </svg>{" "}
                    Upload photo...
                  </label>
                  <input
                    id="workout-image-input"
                    type="file"
                    name="picture"
                    accept="image/*"
                    onChange={handleChange}
                    required
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
        </Box>
      </Modal>
    </div>
  );
}
