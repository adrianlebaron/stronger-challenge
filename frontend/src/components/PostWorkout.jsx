import Modal from "react-modal";
import moment from "moment";
import axios from "axios";
import Cookies from "js-cookie";
import Spinner from "../../spinners/spinner";
import { useState } from "react";

export default function PostWorkout() {
    const [showModal, setShowModal] = useState('')
    const [modalDate, setModalDate] = useState(null);
    const [imgPreview, setImagePreview] = useState(null);
    const [imgData, setImageData] = useState(null);
    const [checkedInDates, SetCheckedInDates] = useState([]);
    const [dates, setDates] = useState([]);


    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            modalDate: null,
            imgPreview: null,
            imgData: null,
            checkedInDates: [],
            dates: [],
            buttonDisabled: false,
            showSpinner: false,
            hours: 0,
            minutes: 0,
        };

        this.handleClosedModal = this.handleClosedModal.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.getWeek = this.getWeek.bind(this);
    }

    getWeek() {
        var dates = [];

        let today = moment();
        let from_date = today.clone().isoWeekday(1);
        let to_date = today.clone().endOf("isoWeek");

        let times_ran = 0;

        while (from_date.isSameOrBefore(to_date)) {
            times_ran += 1;

            if (times_ran > 10) {
                break;
            }
            dates.push(from_date.format("MM/DD/YYYY"));
            from_date = from_date.add(1, "day");
        }

        this.setState({
            dates: dates,
        });

        axios.get("http://127.0.0.1:8000/api/checkIn/", {
            params: {
                dateOne: moment(dates[0]).format("YYYY-MM-DD"),
                dateTwo: moment(dates[6]).format("YYYY-MM-DD"),
            },
            headers: {
                Authorization: `Token ${Cookies.get("access_token")}`,
            },
        }).then((response) => {
            let checkedDates = [];
            let dateObj = [];
            response.data.checkIn.map((obj) => {
                checkedDates.push(obj.date), dateObj.push(obj);
            });
            this.setState({
                checkedInDates: checkedDates,
                dateObjs: dateObj,
            });
        });
    }

    placeDates() {
        let cutoffDate = moment().subtract(3, "days").format("MM/DD/YYYY");
        let today = moment().format("MM/DD/YYYY");
        return this.state.dates.map((date) => {
            if (
                this.state.checkedInDates.includes(moment(date).format("YYYY-MM-DD"))
            ) {
                // if this date already has been checked in, return a checked in box to show date details
                return (
                    <div
                        onClick={() => this.handleOpenModal(date)}
                        className="week-day checkedIn"
                        key={date}
                    >
                        <div className="day">{moment(date).format("ddd")}</div>
                        <div className="date">{moment(date).format("DD")}</div>
                    </div>
                );
            } else if (
                moment(date).format("MM/DD/YYYY") < cutoffDate ||
                moment(date).format("MM/DD/YYYY") > today
            ) {
                // if this date is is in the future or past the cut off date, return a locked box
                return (
                    <div className="week-day locked" key={date}>
                        <div className="day">{moment(date).format("ddd")}</div>
                        <div className="date">{moment(date).format("DD")}</div>
                    </div>
                );
            } else if (moment(date).format("DD") == moment().format("DD")) {
                // if this date is today, apply today className
                return (
                    <div
                        onClick={() => this.handleOpenModal(date)}
                        className="week-day today"
                        key={date}
                    >
                        <div className="day">{moment(date).format("ddd")}</div>
                        <div className="date">{moment(date).format("DD")}</div>
                    </div>
                );
            } else {
                // return a regular date/box
                return (
                    <div
                        onClick={() => this.handleOpenModal(date)}
                        className="week-day"
                        key={date}
                    >
                        <div className="day">{moment(date).format("ddd")}</div>
                        <div className="date">{moment(date).format("DD")}</div>
                    </div>
                );
            }
        });
    }

    handleOpenModal(num) {
        let selectedDate = [];
        if (this.state.dates.includes(num)) {
            if (this.state.dateObjs) {
                this.state.dateObjs.map((obj) => {
                    if (obj.date === moment(num).format("YYYY-MM-DD")) {
                        selectedDate.push(obj);
                    }
                });
            }
        }
        this.setState({
            showModal: true,
            modalDate: num,
            selectedDateObj: selectedDate[0],
        });
    }

    handleClosedModal() {
        this.setState({
            showModal: false,
            hours: 0,
            minutes: 0,
            imgData: null,
            imgPreview: null,
            modalDate: null,
            workoutType: null,
        });
    }

    handleChange(event) {
        if (event.target.name === "picture") {
            this.setState({
                imgPreview: URL.createObjectURL(event.target.files[0]),
            });

            let reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = () => this.setState({ imgData: reader.result });
        } else {
            this.setState({
                [event.target.name]: event.target.value,
            });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            buttonDisabled: true,
            showSpinner: true,
        });
        axios.post(
            "http://127.0.0.1:8000/api/checkIn/",
            {
                imgData: this.state.imgData,
                date: moment(this.state.modalDate).format("YYYY-MM-DD"),
                workoutDuration: this.state.hours + ":" + this.state.minutes,
                workoutType: this.state.workoutType,
            },
            {
                headers: {
                    Authorization: `Token ${Cookies.get("access_token")}`,
                },
            }
        ).then((response) => {
            if (response.data.checkIn) {
                this.setState({
                    selectedDateObj: response.data.checkIn,
                });
                this.getWeek();
            } else {
            }
        });
    }

    componentDidMount() {
        Modal.setAppElement("body");
        this.getWeek();
    }

    return (
        <div className="header">
            {this.placeDates()}

            <Modal
                className="Modal"
                overlayClassName="Overlay"
                isOpen={this.state.showModal}
                contentLabel="Modal Example"
                shouldCloseOnOverlayClick={true}
                onRequestClose={this.handleClosedModal}
            >
                <form className="checkin-form" onSubmit={this.handleSubmit}>
                    <div className="modal-header">
                        <p className="modal-title">{this.state.modalDate}</p>
                        <button className="modal-close" onClick={this.handleClosedModal}>
                            x
                        </button>
                    </div>
                    {this.state.selectedDateObj ? (
                        <div className="modal-body checkin-body">
                            <div className="workout-details">
                                <p className="amount">
                                    {this.state.selectedDateObj.workoutLength}
                                </p>
                                <p className="amount">
                                    {this.state.selectedDateObj.workoutType}
                                </p>
                            </div>
                            <div className="picture-container">
                                <div className="img-preview">
                                    <img
                                        id="progress-image"
                                        src={this.state.selectedDateObj.picture}
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="modal-body checkin-body">
                            {this.state.showSpinner ? <Spinner /> : null}
                            <div className="workout-details">
                                <div className="time-container">
                                    <label htmlFor="">Length of Workout</label>
                                    <div className="time">
                                        <div className="hours">
                                            <label htmlFor="">HR</label>
                                            <select
                                                name="hours"
                                                id=""
                                                onChange={this.handleChange}
                                                required
                                            >
                                                <option value="0">0</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                                <option value="11">11</option>
                                                <option value="12">12</option>
                                            </select>
                                        </div>
                                        <div className="minutes">
                                            <label htmlFor="">MIN</label>
                                            <select
                                                name="minutes"
                                                id=""
                                                onChange={this.handleChange}
                                                required
                                            >
                                                <option value="" disabled selected>
                                                    Minutes
                                                </option>
                                                <option value="0">0</option>
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="15">15</option>
                                                <option value="20">20</option>
                                                <option value="25">25</option>
                                                <option value="30">30</option>
                                                <option value="35">35</option>
                                                <option value="40">40</option>
                                                <option value="45">45</option>
                                                <option value="50">50</option>
                                                <option value="55">55</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="workout-container">
                                    <label htmlFor="">Types of Workout</label>
                                    <select
                                        name="workoutType"
                                        onChange={this.handleChange}
                                        required
                                    >
                                        <option value="" disabled selected>
                                            Select your workout
                                        </option>
                                        <option value="WEIGHTS">Weights</option>
                                        <option value="CARDIO">Cardio</option>
                                        <option value="SWIMMING">Swimming</option>
                                        <option value="RUNNING">Running</option>
                                        <option value="CYCLING">Cycling</option>
                                        <option value="SPORTS">Sports</option>
                                        <option value="SOCCER">Soccer</option>
                                        <option value="VOLLEYBALL">Volleyball</option>
                                        <option value="GOLF">Golf</option>
                                        <option value="HUNTING">Hunting</option>
                                        <option value="HIKING">Hiking</option>
                                        <option value="HIIT">HIIT</option>
                                        <option value="CALISTHENICS">Calisthenics</option>
                                        <option value="YOGA">Yoga</option>
                                        <option value="CROSSFIT">Crossfit</option>
                                        <option value="BASKETBALL">Basketball</option>
                                        <option value="DISCGOLF">Disc golf</option>
                                        <option value="RACQUETBALL">Racquetball</option>
                                        <option value="FOOTBALL">Football</option>
                                    </select>
                                </div>
                            </div>
                            <div className="picture-container">
                                <label htmlFor="workout-image-input">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="17"
                                        viewBox="0 0 20 17"
                                    >
                                        <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
                                    </svg>{" "}
                                    Upload photo...
                                </label>
                                <input
                                    id="workout-image-input"
                                    type="file"
                                    name="picture"
                                    accept="image/*"
                                    onChange={this.handleChange}
                                    required
                                />

                                <div className="img-preview">
                                    <img src={this.state.imgPreview} alt="" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="modal-footer">
                        {this.state.selectedDateObj ? (
                            // <LogoSVG />
                            <img
                                className="logo-png"
                                src="/assets/koslogorough-transparent.png"
                            />
                        ) : (
                            <button type="submit" disabled={this.state.buttonDisabled}>
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            </Modal>
        </div>
    );
}
