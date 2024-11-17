import { useState, useEffect } from 'react';
import Candidate from '../interfaces/Candidate.interface';

const SavedCandidates = () => {

  const [candidates, setCandidates] = useState<Candidate[] | null>(null);

  useEffect(() => {
    const potentialCandidates = getPotentialCandidates();
    setCandidates(potentialCandidates);
  }, []);

  const getPotentialCandidates = (): Candidate[] => {
    let parsedCandidates: Candidate[] = [];
    const potentialCandidates = localStorage.getItem('potentialCandidates');
    if (potentialCandidates) {
      parsedCandidates = JSON.parse(potentialCandidates);
    }
    return parsedCandidates;
  };

  const removeCandidate = (user: string): void => {
    if (candidates) {
      const filteredCandidates: Candidate[] = candidates?.filter(
        (candidate) => candidate.login !== user
      );
      const parsedCandidates = JSON.stringify(filteredCandidates);
      localStorage.setItem('potentialCandidates', parsedCandidates);
      setCandidates(filteredCandidates);
    }
  };

  return (
    <>
      <h1 className="mb-3">Potential Candidates</h1>
      {candidates && candidates.length > 0 ? (
        <table className="table table-dark table-striped table-bordered">
          <thead>
            <tr className="text-center">
              <th scope="col">Image</th>
              <th scope="col">Name</th>
              <th scope="col">Location</th>
              <th scope="col">Email</th>
              <th scope="col">Company</th>
              <th scope="col">Bio</th>
              <th scope="col">Reject</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => (
              <tr key={index}>
                <td className={index % 2 === 0 ? 'bg-light' : 'bg-dark'}>
                  <img
                    src={candidate.avatar_url}
                    className='img-fluid'
                    alt={candidate.login}
                  />
                </td>
                <td className="align-middle p-3">{candidate.login}</td>
                <td className="align-middle p-3">{candidate.location ? candidate.location : 'N/A'}</td>
                <td className="align-middle p-3">{candidate.email ? candidate.email : 'N/A'}</td>
                <td className="align-middle p-3">{candidate.company ? candidate.company : 'N/A'}</td>
                <td className="align-middle p-3">{candidate.bio ? candidate.bio : 'N/A'}</td>
                <td className="text-center align-middle">
                  <button
                    className='btn btn-danger'
                    onClick={() => removeCandidate(candidate.login)}
                  >
                    <i className="bi bi-dash-lg"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No candidates to display.</p>
      )}
    </>
  );
};

export default SavedCandidates;
