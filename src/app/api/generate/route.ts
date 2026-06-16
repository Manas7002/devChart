export async function POST(request: Request) {
    try {
        const { title, priority } = await request.json();

        const descriptions: Record<string, string[]> = {
            high: [
                `Complete ${title} immediately as it is critical to project success. Ensure all stakeholders are informed and blockers are resolved quickly.`,
                `This high-priority task "${title}" requires immediate attention. Coordinate with the team to deliver results without delay.`,
            ],
            medium: [
                `Work on "${title}" during the current sprint. Allocate sufficient time to ensure quality delivery within the planned timeline.`,
                `"${title}" is a key task this week. Plan and execute carefully to meet team expectations and project goals.`,
            ],
            low: [
                `"${title}" can be completed when bandwidth allows. Keep it in the backlog and pick it up between higher priority items.`,
                `Address "${title}" as time permits. Document progress and ensure it gets completed before the next review cycle.`,
            ],
        };

        const list = descriptions[priority.toLowerCase()] || descriptions["medium"];
        const description = list[Math.floor(Math.random() * list.length)];

        return Response.json({ description });
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Failed to generate description" },
            { status: 500 }
        );
    }
}