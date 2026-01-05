import { Sparkles, Loader2, Shield, AlertTriangle, Clock } from "lucide-react";
import { TeamAnalysis } from "@/hooks/useAISuggestions";

interface TeamAnalysisCardProps {
  analysis: TeamAnalysis | null;
  isLoading: boolean;
}

const TeamAnalysisCard = ({ analysis, isLoading }: TeamAnalysisCardProps) => {
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
          <span className="text-yellow-500 font-medium">در حال تحلیل ترکیب تیم...</span>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-yellow-500/10 to-primary/10 border border-yellow-500/30 rounded-xl p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-bold text-yellow-500">تحلیل هوش مصنوعی</h3>
      </div>

      {/* Playstyle */}
      <div className="text-center mb-4">
        <span className="inline-block px-4 py-2 bg-primary/20 rounded-full text-primary font-bold text-lg">
          {analysis.playstyle}
        </span>
      </div>

      {/* Description */}
      <p className="text-foreground/90 text-center mb-6 leading-relaxed">
        {analysis.description}
      </p>

      {/* Timing */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          زمان قدرت: <span className="text-foreground font-medium">{analysis.timing}</span>
        </span>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-green-500" />
            <h4 className="font-semibold text-green-500">نقاط قوت</h4>
          </div>
          <ul className="space-y-2">
            {analysis.strengths?.map((strength, idx) => (
              <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h4 className="font-semibold text-red-500">نقاط ضعف</h4>
          </div>
          <ul className="space-y-2">
            {analysis.weaknesses?.map((weakness, idx) => (
              <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeamAnalysisCard;
