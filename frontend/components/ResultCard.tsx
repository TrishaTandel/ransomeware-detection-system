export default function ResultCard({ result }: any) {
  return (
    <div className="mt-6 p-4 bg-gray-200 rounded">
      <h2 className="font-bold text-lg">
        Prediction: {result.prediction}
      </h2>
      <p>Probability: {(result.probability * 100).toFixed(2)}%</p>
      <p>Confidence: {result.confidence}</p>
    </div>
  );
}