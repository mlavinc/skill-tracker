import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

export function useSkills(userId) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = userId
        ? await api.getUserSkills(userId)
        : await api.getSkills();
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const createSkill = async (payload) => {
    const body = userId ? { ...payload, user_id: userId } : payload;
    const created = await api.createSkill(body);
    await fetchSkills();
    return created;
  };

  const updateSkill = async (id, payload) => {
    const updated = await api.updateSkill(id, payload);
    await fetchSkills();
    return updated;
  };

  const deleteSkill = async (id) => {
    await api.deleteSkill(id);
    await fetchSkills();
  };

  return {
    skills,
    loading,
    error,
    fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  };
}

export function useSkill(id) {
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkill = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSkill(id);
      setSkill(data);
    } catch (err) {
      setError(err.message);
      setSkill(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSkill();
  }, [fetchSkill]);

  return { skill, loading, error, fetchSkill, setSkill };
}

export function useSessions(skillId) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async () => {
    if (!skillId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSessions(skillId);
      const list = Array.isArray(data) ? data : [];
      setSessions(list);
    } catch (err) {
      setError(err.message);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [skillId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const createSession = async (payload) => {
    const created = await api.createSession(skillId, payload);
    await fetchSessions();
    return created;
  };

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    createSession,
  };
}

export function useDashboardStats(skills) {
  const [totalSessions, setTotalSessions] = useState(0);
  const [loadingSessions, setLoadingSessions] = useState(false);

  useEffect(() => {
    if (!skills.length) {
      setTotalSessions(0);
      return;
    }

    let cancelled = false;

    async function loadSessionCounts() {
      setLoadingSessions(true);
      try {
        const results = await Promise.all(
          skills.map((skill) => api.getSessions(skill.id))
        );
        if (!cancelled) {
          const total = results.reduce(
            (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
            0
          );
          setTotalSessions(total);
        }
      } catch {
        if (!cancelled) setTotalSessions(0);
      } finally {
        if (!cancelled) setLoadingSessions(false);
      }
    }

    loadSessionCounts();
    return () => {
      cancelled = true;
    };
  }, [skills]);

  const totalSkills = skills.length;
  const completedSkills = skills.filter((s) => s.progreso >= 100).length;
  const averageProgress =
    totalSkills > 0
      ? Math.round(
          skills.reduce((sum, s) => sum + (s.progreso ?? 0), 0) / totalSkills
        )
      : 0;

  return {
    totalSkills,
    completedSkills,
    averageProgress,
    totalSessions,
    loadingSessions,
  };
}
