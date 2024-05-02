import { useState, useEffect } from "react";
import { authStore } from "../../stores/auth_store/Store"; // Import authStore
import PostWorkout from "../../components/PostWorkout";

export default function Dashboard() {
  const { user } = authStore((state) => state); // Get user from authStore
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setShowSuccess(urlParams.get('success'));
  }, []);

  if (user) {
    return (
      <div className="dashboard">
        <div className="body">
          {showSuccess ? (
            <p style={{ color: 'green', fontSize: '30px', marginBottom: '50px' }}>Congrats, you have registered successfully!</p>
          ) : null}
          <PostWorkout />
        </div>
      </div>
    );
  }
}