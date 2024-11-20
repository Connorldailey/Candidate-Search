import { useState, useEffect } from 'react';
import Candidate from '../interfaces/Candidate.interface';

const SavedCandidates = () => {

  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');

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

  const handleSort = (sortParam: keyof Candidate) => {
    // Determine new sort direction
    const newSortDir = sortParam !== sortBy || sortDirection === 'descending' ? 'ascending' : 'descending';
    // Set state variables
    setSortBy(sortParam);
    setSortDirection(newSortDir);
  
    // Sort the array of candidates
    const sortedCandidates = [...(candidates || [])].sort((a, b) => {
      const valueA = a[sortParam] || '';
      const valueB = b[sortParam] || '';

      // Handle sorting direction
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return newSortDir === 'ascending'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
  
      return 0; // Default return value for unexpected cases
    });
  
    setCandidates(sortedCandidates);
  };
  

  return (
    <>
      <h1 className="mb-3">Potential Candidates</h1>
      {candidates && candidates.length > 0 ? (
        <div className='table-responsive'>
          <table className="table table-dark table-striped table-bordered">
            <thead>
              <tr className="text-center">
                <th scope="col" className='text-center align-middle'>Image</th>
                <th scope="col">
                  <span>Name</span>
                  <button
                    className="btn btn-link"
                    onClick={() => handleSort('login')}
                    aria-label="Sort by Name"
                  >
                    <i
                      className={
                        sortBy === 'login'
                          ? sortDirection === 'ascending'
                            ? 'bi bi-sort-alpha-down'
                            : 'bi bi-sort-alpha-down-alt'
                          : 'bi bi-arrow-down-up'
                      }
                    ></i>
                  </button>
                </th>
                <th scope="col">
                  <span>Location</span>
                  <button
                    className="btn btn-link"
                    onClick={() => handleSort('location')}
                    aria-label="Sort by Location"
                  >
                    <i
                      className={
                        sortBy === 'location'
                          ? sortDirection === 'ascending'
                            ? 'bi bi-sort-alpha-down'
                            : 'bi bi-sort-alpha-down-alt'
                          : 'bi bi-arrow-down-up'
                      }
                    ></i>
                  </button>
                </th>
                <th scope="col">
                  <span>Email</span>
                  <button
                    className="btn btn-link"
                    onClick={() => handleSort('email')}
                    aria-label="Sort by Email"
                  >
                    <i
                      className={
                        sortBy === 'email'
                          ? sortDirection === 'ascending'
                            ? 'bi bi-sort-alpha-down'
                            : 'bi bi-sort-alpha-down-alt'
                          : 'bi bi-arrow-down-up'
                      }
                    ></i>
                  </button>
                </th>
                <th scope="col">
                  <span>Company</span>
                  <button
                    className="btn btn-link"
                    onClick={() => handleSort('company')}
                    aria-label="Sort by Company"
                  >
                    <i
                      className={
                        sortBy === 'company'
                          ? sortDirection === 'ascending'
                            ? 'bi bi-sort-alpha-down'
                            : 'bi bi-sort-alpha-down-alt'
                          : 'bi bi-arrow-down-up'
                      }
                    ></i>
                  </button>
                </th>
                <th scope="col" className='text-center align-middle'>Bio</th>
                <th scope="col" className='text-center align-middle'>Reject</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, index) => (
                <tr key={index}>
                  <td className={index % 2 === 0 ? 'bg-light' : 'bg-dark'}>
                    <img
                      src={candidate.avatar_url}
                      className="img-fluid img-thumbnail"
                      alt={candidate.login}
                    />
                  </td>
                  <td className="align-middle p-3">{candidate.login}</td>
                  <td className="align-middle p-3">
                    {candidate.location ? candidate.location : 'N/A'}
                  </td>
                  <td className="align-middle p-3">
                    {candidate.email ? candidate.email : 'N/A'}
                  </td>
                  <td className="align-middle p-3">
                    {candidate.company ? candidate.company : 'N/A'}
                  </td>
                  <td className="align-middle p-3">
                    {candidate.bio ? candidate.bio : 'N/A'}
                  </td>
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCandidate(candidate.login)}
                    >
                      <i className="bi bi-dash-lg"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No candidates to display.</p>
      )}
    </>
  );
};

export default SavedCandidates;
