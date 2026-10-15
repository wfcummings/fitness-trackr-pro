import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { getRoutine, deleteRoutine } from "../api/activities";
import SetList from "../sets/SetList";

export default function RoutineDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [routine, setRoutine] = useState(null);
  const syncRoutine = async (id) => {
    const data = await getRoutine(id);
    setRoutine(data);
  };
  useEffect(() => {
    syncRoutine(id);
  }, [id]);

  const [error, setError] = useState(null);
  const tryDelete = async () => {
    setError(null);

    try {
      await deleteRoutine(token, routine.id);
      navigate("/routines");
    } catch (e) {
      setError(e.message);
    }
  };
  if (!routine) {
    return <p>Loading...</p>;
  }

  return (
    <article>
      <h1>{routine.name}</h1>
      <p>by: {routine.creatorName}</p>
      <p>{routine.goal}</p>
      {token && <button onClick={tryDelete}>Delete</button>}
      {error && <p role="alert">{error}</p>}
      <SetList sets={routine.sets} />
    </article>
  );
}
