'use strict';

const { tiers, bans, defCost, maxPoints } = require('./tiers');

exports.BattleFormats = {
	points: {
		effectType: 'ValidatorRule',
		name: 'Points',
		desc: ["Gives players 1000 of points to spend on Pok&eacute;mon"],
		onValidateTeam: function (team, format) {
			const getCost = species => {
				for (const i of tiers) {
					if (i[1].includes(species)) return i[0];
				}
				return defCost;
			};

			let problems = [];
			let points = maxPoints;

			for (const set of team) {
				let template = this.getTemplate(set.species || set.name);
				const item = this.getItem(set.item);
				const ability = this.getAbility(set.ability);

				let postMegaTemplate = template;
				if (item.megaEvolves === template.species) {
					if (!item.megaStone) throw new Error(`Item ${item.name} has no base form for mega evolution`);
					postMegaTemplate = this.getTemplate(item.megaStone);
				}
				if (['Mega', 'Mega-X', 'Mega-Y'].includes(postMegaTemplate.forme)) {
					template = postMegaTemplate;
				}
				
				if (bans.includes(template.species)) problems.push(`${template.species} is banned.`);
				else {
					let cost = getCost(template.species);
					console.log(`${template.species} cost ${cost}!`);
					points -= cost;
				}
			}

			if (points < 0) {
				problems.push(`You have spent more than the maximum ${maxPoints} points.`);
			}

			if (problems.length !== 0) {
				return problems.join('<br>');
			}
		},
	},
};
