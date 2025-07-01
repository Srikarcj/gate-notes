import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target, 
  Award,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  TrendingUp
} from 'lucide-react'
import { useAdvancedStudyStore } from '../../store/advancedStudyStore'

const InteractiveQuiz = ({ topic, questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  
  const { submitProblemSolution } = useAdvancedStudyStore()

  useEffect(() => {
    setStartTime(Date.now())
    if (questions[currentQuestion]?.timeLimit) {
      setTimeLeft(questions[currentQuestion].timeLimit)
    }
  }, [currentQuestion, questions])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleNextQuestion()
    }
  }, [timeLeft])

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
      if (questions[currentQuestion + 1]?.timeLimit) {
        setTimeLeft(questions[currentQuestion + 1].timeLimit)
      }
    } else {
      completeQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
      if (questions[currentQuestion - 1]?.timeLimit) {
        setTimeLeft(questions[currentQuestion - 1].timeLimit)
      }
    }
  }

  const completeQuiz = () => {
    const totalTime = Date.now() - startTime
    const correctAnswers = questions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
    }, 0)
    
    const score = Math.round((correctAnswers / questions.length) * 100)
    
    setQuizCompleted(true)
    setShowResults(true)
    
    // Save quiz results
    submitProblemSolution(`quiz_${topic}`, JSON.stringify(selectedAnswers), score >= 70, totalTime)
    
    if (onComplete) {
      onComplete({
        score,
        correctAnswers,
        totalQuestions: questions.length,
        timeSpent: totalTime,
        answers: selectedAnswers
      })
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setQuizCompleted(false)
    setShowExplanation(false)
    setStartTime(Date.now())
    if (questions[0]?.timeLimit) {
      setTimeLeft(questions[0].timeLimit)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400'
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Excellent! You have mastered this topic!'
    if (score >= 70) return 'Good job! You have a solid understanding.'
    if (score >= 50) return 'Not bad, but there\'s room for improvement.'
    return 'Keep studying! Review the material and try again.'
  }

  if (showResults) {
    const correctAnswers = questions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
    }, 0)
    const score = Math.round((correctAnswers / questions.length) * 100)

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Award className="w-10 h-10 text-white" />
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Quiz Completed!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {topic} Assessment
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {correctAnswers}/{questions.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {Math.floor((Date.now() - startTime) / 1000)}s
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className={`font-medium ${getScoreColor(score)}`}>
              {getScoreMessage(score)}
            </p>
          </div>

          {/* Detailed Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Question Review
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {questions.map((question, index) => {
                const isCorrect = selectedAnswers[index] === question.correctAnswer
                const userAnswer = selectedAnswers[index]
                
                return (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Q{index + 1}: {question.question}
                        </p>
                        <div className="text-xs space-y-1">
                          <div className="text-gray-600 dark:text-gray-400">
                            Your answer: {question.options[userAnswer] || 'Not answered'}
                          </div>
                          {!isCorrect && (
                            <div className="text-green-600 dark:text-green-400">
                              Correct answer: {question.options[question.correctAnswer]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
            <button
              onClick={() => setShowResults(false)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              Continue Learning
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  const question = questions[currentQuestion]
  const isAnswered = selectedAnswers[currentQuestion] !== undefined
  const isCorrect = selectedAnswers[currentQuestion] === question.correctAnswer

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {topic} Quiz
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {timeLeft !== null && (
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 rounded-lg">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{timeLeft}s</span>
            </div>
          )}
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {Object.keys(selectedAnswers).length}/{questions.length} answered
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index
              const isCorrectOption = index === question.correctAnswer
              
              let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 "
              
              if (showExplanation) {
                if (isCorrectOption) {
                  buttonClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                } else if (isSelected && !isCorrectOption) {
                  buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                } else {
                  buttonClass += "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                }
              } else if (isSelected) {
                buttonClass += "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
              } else {
                buttonClass += "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10"
              }

              return (
                <button
                  key={index}
                  onClick={() => !showExplanation && handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      showExplanation && isCorrectOption ? 'border-green-500 bg-green-500' :
                      showExplanation && isSelected && !isCorrectOption ? 'border-red-500 bg-red-500' :
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {(isSelected || (showExplanation && isCorrectOption)) && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && question.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-1">
                      Explanation
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-3">
            {isAnswered && !showExplanation && question.explanation && (
              <button
                onClick={() => setShowExplanation(true)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                Show Explanation
              </button>
            )}
            
            <button
              onClick={handleNextQuestion}
              disabled={!isAnswered}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default InteractiveQuiz
