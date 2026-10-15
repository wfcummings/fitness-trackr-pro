import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { getActivity, deleteActivity } from "../api/activities";

export default function ActivityDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const syncActivity = async () => {
      const data = await getActivity(id);
      setActivity(data);
    };
    syncActivity();
  }, [id]);

  const tryDelete = async () => {
    setError(null);

    try {
      await deleteActivity(token, activity.id);
      navigate("/activities");
    } catch (e) {
      setError(e.message);
    }
  };
  if (!activity) {
    return <p>Loading...</p>;
  }

  return (
    <article>
      <h1>{activity.name}</h1>
      <p>{activity.description}</p>
      <p>by: {activity.creatorName}</p>
      {token && <button onClick={tryDelete}>Delete</button>}
      {error && <p role="alert">{error}</p>}
    </article>
  );
}
