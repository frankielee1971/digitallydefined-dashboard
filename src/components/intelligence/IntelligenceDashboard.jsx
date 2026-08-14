import SuperpowerCard from "./SuperpowerCard";
import PersonaCard from "./PersonaCard";
import StrengthsList from "./StrengthsList";
import BlindspotsList from "./BlindspotsList";
import BusinessModelCard from "./BusinessModelCard";

import RoadmapView from "./RoadmapView";
import TrendsView from "./TrendsView";
import CompetitionView from "./CompetitionView";
import OpportunitiesView from "./OpportunitiesView";
import AudienceInsightsView from "./AudienceInsightsView";

export default function IntelligenceDashboard({ data }) {
  if (!data) return <div>Loading intelligence...</div>;

  return (
    <div className="intelligence-dashboard">
      <section>
        <SuperpowerCard superpower={data.superpower} />
        <PersonaCard persona={data.persona} />
        <BusinessModelCard businessModel={data.businessModel} />
      </section>

      <section>
        <StrengthsList strengths={data.strengths} />
        <BlindspotsList blindspots={data.blindspots} />
      </section>

      <section>
        <RoadmapView roadmap={data.roadmap} />
      </section>

      <section>
        <TrendsView trends={data.trends} />
        <CompetitionView competition={data.competition} />
        <OpportunitiesView opportunities={data.opportunities} />
        <AudienceInsightsView audience={data.audience} />
      </section>
    </div>
  );
}
