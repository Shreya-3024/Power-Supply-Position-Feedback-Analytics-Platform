import React, { useState, useRef } from 'react';
import { Upload, X, Star } from 'lucide-react';
import { toast } from 'sonner';

const FeedbackForm = ({ onSuccess }) => {
  // Basic Info State
  const [selectedCase, setSelectedCase] = useState('');
  const [selectedPsu, setSelectedPsu] = useState('');
  const [placement, setPlacement] = useState('');
  const [fanDirection, setFanDirection] = useState('');
  const [caseSearchInput, setCaseSearchInput] = useState('');
  const [psuSearchInput, setPsuSearchInput] = useState('');
  const [showCaseDropdown, setShowCaseDropdown] = useState(false);
  const [showPsuDropdown, setShowPsuDropdown] = useState(false);

  // Performance State
  const [temperature, setTemperature] = useState(0);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [installationStars, setInstallationStars] = useState(0);
  const [recommend, setRecommend] = useState(false);

  // Extra Details State
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [commonProblems, setCommonProblems] = useState([]);
  const fileInputRef = useRef(null);

  // Mock data for dropdowns
  const cases = ['Corsair 5000T', 'NZXT H7 Flow', 'Lian Li O11', 'Fractal Design North', 'Thermaltake Core P3'];
  const psus = ['Corsair RM850x', 'EVGA SuperNOVA 750G2', 'Seasonic Focus Plus 750W', 'Be Quiet! Straight Power 11'];
  const problemOptions = [
    'Power supply dead',
    'Connector issues',
    'Fan noise',
    'Cable management',
    'Overheating',
    'Coil whine',
    'Connector looseness'
  ];

  // Filter functions
  const filteredCases = cases.filter(c => c.toLowerCase().includes(caseSearchInput.toLowerCase()));
  const filteredPsus = psus.filter(p => p.toLowerCase().includes(psuSearchInput.toLowerCase()));

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (uploadedFiles.length + files.length > 3) {
      toast.error('Maximum 3 photos allowed');
      return;
    }
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  // Handle problem selection
  const toggleProblem = (problem) => {
    setCommonProblems(prev =>
      prev.includes(problem) ? prev.filter(p => p !== problem) : [...prev, problem]
    );
  };

  // Temperature scale emoji
  const tempEmojis = ['🥶 Cooler', '😐 Slightly Cooler', '😐 Same', '🤔 Slightly Hotter', '🔥 Hotter'];
  const noiseEmojis = ['🔇 Silent', '🤫 Quiet', '😐 Normal', '📢 Loud', '🔊 Very Noisy'];

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!selectedCase || !selectedPsu || !placement) {
      toast.error('Please fill in all required basic information');
      return;
    }

    if (placement === 'bottom' && !fanDirection) {
      toast.error('Please select fan direction for bottom placement');
      return;
    }

    if (temperature === 0 || noiseLevel === 0 || installationStars === 0) {
      toast.error('Please complete all performance ratings');
      return;
    }

    try {
      const formData = new FormData();

      // Basic info
      formData.append('case', selectedCase);
      formData.append('psuModel', selectedPsu);
      formData.append('placement', placement);
      if (fanDirection) formData.append('fanDirection', fanDirection);

      // Performance
      formData.append('temperature', temperature);
      formData.append('noiseLevel', noiseLevel);
      formData.append('installation', installationStars);
      formData.append('recommend', recommend);

      // Extra details
      formData.append('notes', additionalNotes);
      formData.append('problems', JSON.stringify(commonProblems));

      // Files
      uploadedFiles.forEach(file => {
        formData.append('photos', file);
      });

      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to submit feedback');

      toast.success('Feedback submitted successfully! 🎉');
      resetForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to submit feedback');
    }
  };

  const resetForm = () => {
    setSelectedCase('');
    setSelectedPsu('');
    setPlacement('');
    setFanDirection('');
    setTemperature(0);
    setNoiseLevel(0);
    setInstallationStars(0);
    setRecommend(false);
    setAdditionalNotes('');
    setUploadedFiles([]);
    setCommonProblems([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Power Supply Feedback Form 📝</h1>
          <p className="text-slate-400">Help us improve by sharing your experience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: BASIC INFO */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 backdrop-blur">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-xl">🔧</span> Section 1: Basic Information
            </h2>

            {/* Case Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                What case do you have? <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cases..."
                  value={selectedCase || caseSearchInput}
                  onChange={(e) => {
                    setCaseSearchInput(e.target.value);
                    setShowCaseDropdown(true);
                  }}
                  onFocus={() => setShowCaseDropdown(true)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {showCaseDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredCases.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setSelectedCase(c);
                          setShowCaseDropdown(false);
                          setCaseSearchInput('');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-600 text-slate-200"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* PSU Model Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                What PSU model? <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search PSU models..."
                  value={selectedPsu || psuSearchInput}
                  onChange={(e) => {
                    setPsuSearchInput(e.target.value);
                    setShowPsuDropdown(true);
                  }}
                  onFocus={() => setShowPsuDropdown(true)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {showPsuDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredPsus.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setSelectedPsu(p);
                          setShowPsuDropdown(false);
                          setPsuSearchInput('');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-600 text-slate-200"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Placement Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Where is PSU placed? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['bottom', 'top', 'front', 'side'].map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setPlacement(pos)}
                    className={`py-2 px-3 rounded-lg font-medium transition capitalize ${
                      placement === pos
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* Fan Direction (conditional) */}
            {placement === 'bottom' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Which way does fan face? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['up', 'down', 'side'].map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => setFanDirection(dir)}
                      className={`py-2 px-3 rounded-lg font-medium transition capitalize ${
                        fanDirection === dir
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {dir}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: PERFORMANCE */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 backdrop-blur">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-xl">⚡</span> Section 2: Performance
            </h2>

            {/* Temperature Change */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-200 mb-4">
                Temperature change? <span className="text-red-400">*</span>
              </label>
              <div className="flex justify-between items-center gap-2">
                {tempEmojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTemperature(idx + 1)}
                    className={`flex-1 py-4 rounded-lg font-medium text-sm transition ${
                      temperature === idx + 1
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Noise Level */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-200 mb-4">
                Noise level? <span className="text-red-400">*</span>
              </label>
              <div className="flex justify-between items-center gap-2">
                {noiseEmojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNoiseLevel(idx + 1)}
                    className={`flex-1 py-4 rounded-lg font-medium text-sm transition ${
                      noiseLevel === idx + 1
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Installation Difficulty Stars */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-200 mb-4">
                Installation difficulty? <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setInstallationStars(star)}
                    className="transition transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`${
                        installationStars >= star
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-500'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">1 = Easy, 5 = Very Difficult</p>
            </div>

            {/* Recommendation */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="recommend"
                checked={recommend}
                onChange={(e) => setRecommend(e.target.checked)}
                className="w-5 h-5 rounded bg-slate-700 border-slate-600 accent-blue-600 cursor-pointer"
              />
              <label htmlFor="recommend" className="text-slate-200 font-medium">
                Would you recommend this PSU? ✅
              </label>
            </div>
          </div>

          {/* SECTION 3: EXTRA DETAILS */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 backdrop-blur">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-xl">📎</span> Section 3: Extra Details (Optional)
            </h2>

            {/* Additional Notes */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Additional notes
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Share any other details or experiences..."
                rows="5"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Upload photos (max 3)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
              >
                <Upload className="mx-auto mb-2 text-slate-400" size={32} />
                <p className="text-slate-300 font-medium">Click to upload or drag and drop</p>
                <p className="text-slate-400 text-sm">PNG, JPG, GIF up to 5MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-32 object-cover rounded-lg border border-slate-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-400 mt-2">
                {uploadedFiles.length}/3 photos uploaded
              </p>
            </div>

            {/* Common Problems */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Check common problems
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {problemOptions.map((problem) => (
                  <button
                    key={problem}
                    type="button"
                    onClick={() => toggleProblem(problem)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                      commonProblems.includes(problem)
                        ? 'bg-red-600/80 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {problem}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>Submit Feedback 🚀</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
