import { useState, useEffect, useCallback } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import Candidate from '../interfaces/Candidate.interface'

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<Candidate | null>(null);

  // Load candidates on component mount
  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const users: Candidate[] = await searchGithub();
        setCandidates(users);
      } catch (error) {
        console.error('Error loading candidates:', error);
      }
    };
    loadCandidates();
  }, []);

  // Move to the next candidate
  const handleNextCandidate = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex < candidates.length - 1 ? prevIndex + 1 : prevIndex
    );
  }, [candidates]);

  // Fetch details of the current candidate
  useEffect(() => {
    const getUserDetails = async () => {
      if (candidates.length === 0 || currentIndex >= candidates.length) {
        setCurrentUser(null);
        return;
      }
      const { login } = candidates[currentIndex];
      if (!login) {
        handleNextCandidate();
        return;
      }
      try {
        const userDetails = await searchGithubUser(login);
        if (userDetails?.login) {
          const { login, location, email, company, bio, avatar_url } = userDetails;
          setCurrentUser({ login, location, email, company, bio, avatar_url });
        } else {
          console.log(`User ${login} not found. Skipping to next user.`);
          handleNextCandidate();
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        handleNextCandidate();
      }
    }
    getUserDetails();
  }, [candidates, currentIndex, handleNextCandidate]);

  // Save the current candidate and move to the next one
  const handleSaveCandidate = () => {
    if (currentUser) {
      addToPotentialCandidatesList(currentUser);
    }
    handleNextCandidate();
  };

  // Save a candidate to the list of potential candidates in local storage
  const addToPotentialCandidatesList = (currentUser: Candidate) => {
    try {
      let parsedCandidates: Candidate[] = [];
      const storedCandidates = localStorage.getItem('potentialCandidates');
      if (typeof storedCandidates === 'string') {
        parsedCandidates = JSON.parse(storedCandidates);
      }
      parsedCandidates.push(currentUser);
      localStorage.setItem('potentialCandidates', JSON.stringify(parsedCandidates));
    } catch (error) {
      console.error('Error saving candidate to localStorage:', error);
    }
  };

  return (
    <>
      <h1>Candidate Search</h1>
      {currentUser ? (
        // Display the current candidate's details
        <div className='card candidate-card'>
          {currentUser.avatar_url ? (
            <img
              src={currentUser.avatar_url}
              className='card-img-top'
              alt={currentUser.login}
            />
          ) : (
            <img
              src='/placeholder.png'
              className='card-img-top'
              alt='Placeholder'
            />
          )}
          <div className='card-body'>
            <h2 className='card-title'>{currentUser.login}</h2>
            <p><strong>Location:</strong> {currentUser.location || 'N/A'}</p>
            <p><strong>Email:</strong> {currentUser.email || 'N/A'}</p>
            <p><strong>Company:</strong> {currentUser.company || 'N/A'}</p>
            <p><strong>Bio:</strong> {currentUser.bio || 'N/A'}</p>
          </div>
        </div>
      ) : (
        // Message to display if no candidates are available
        <p>No more candidates available</p>
      )}
      {/* Buttons to skip or save candidates */}
      <div className="btn-container">
        <button onClick={handleNextCandidate} className='btn btn-danger btn-lg rounded-circle'>
          <i className="bi bi-dash-lg"></i>
        </button>
        <button onClick={handleSaveCandidate} className='btn btn-success btn-lg rounded-circle'>
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>
    </>
  );
};

export default CandidateSearch;

