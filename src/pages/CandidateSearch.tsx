import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import Candidate from '../interfaces/Candidate.interface'

const CandidateSearch = () => {

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<Candidate | null>(null);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const users: Candidate[] = await searchGithub();
        setCandidates(users);
        if (users.length > 0) {
          setCurrentUser(users[0]);
        }
      } catch (error) {
        console.error('Error loading candidates:', error);
      }
    };
    loadCandidates();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      if (candidates.length > 0 && currentIndex < candidates.length) {
        const searchUser = candidates[currentIndex]?.login;
        if (!searchUser) {
          handleNextCandidate();
          return;
        }
        try {
          const user = await searchGithubUser(searchUser);
          if (user?.login) {
            const { login, location, email, company, bio, avatar_url } = user;
            setCurrentUser({ login, location, email, company, bio, avatar_url });
          } else {
            console.log(`User ${searchUser} not found. Skipping to next user.`);
            handleNextCandidate();
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          handleNextCandidate();
        }
      } else {
        setCurrentUser(null);
      }
    };
    getUser();
  });

  // Save the current candidate and move to the next one
  const handleSaveCandidate = () => {
    if (currentUser) {
      addToPotentialCandidatesList(currentUser);
    }
    handleNextCandidate();
  };

  // Move to the next candidate
  const handleNextCandidate = () => {
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentUser(null);
      console.log("No more candidates available");
    }
  };

  const addToPotentialCandidatesList = (currentUser: Candidate) => {
    let parsedCandidates: Candidate[] = [];
    const storedCandidates = localStorage.getItem('potentialCandidates');
    if (typeof storedCandidates === 'string') {
      parsedCandidates = JSON.parse(storedCandidates);
    }
    parsedCandidates.push(currentUser);
    localStorage.setItem('potentialCandidates', JSON.stringify(parsedCandidates));
  };

  return (
    <>
      <h1>Candidate Search</h1>
      {currentUser ? (
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
        <p>No more candidates available</p>
      )}
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

