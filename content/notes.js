window.PPL_NOTES = [
  {
    id: "density-altitude-and-pressure",
    title: "為什麼不能只從氣壓判斷密度高度？",
    summary: "相同氣壓下，溫度仍會改變單位體積內的空氣分子數，因此也會改變空氣密度與飛機性能。",
    category: "Aerodynamics",
    tags: ["density altitude", "pressure", "temperature", "PV=nRT"],
    updated: "2026-07-13",
    sections: [
      {
        type: "question",
        title: "核心問題",
        body: [
          "為什麼 density altitude（密度高度）沒辦法只從氣壓看出來？",
          "不管冷或熱，如果都是 1 atm，同一個盒子裡的空氣分子數不是應該一樣嗎？"
        ]
      },
      {
        type: "text",
        title: "關鍵觀念",
        body: [
          "氣壓不只取決於空氣分子有多少，也取決於分子移動得多快，而分子運動速度受到溫度影響。",
          "所以同樣是 1 atm，熱空氣和冷空氣每立方公尺內的分子數可以不同。"
        ]
      },
      {
        type: "formula",
        title: "從理想氣體方程式理解",
        formula: "\\frac{n}{V} = \\frac{P}{RT}",
        body: [
          "由理想氣體方程式 $PV = nRT$，將體積固定並整理可得上式。",
          "$n / V$ 代表單位體積內的物質量；$P$ 是氣壓；$T$ 是絕對溫度（Kelvin）。",
          "當氣壓 $P$ 相同時，溫度 $T$ 越高，單位體積內的分子越少，因此空氣密度越低。"
        ]
      },
      {
        type: "image",
        title: "冷空氣與熱空氣",
        image: {
          src: "images/density-air-comparison.svg",
          alt: "相同氣壓下，冷空氣含有較多慢速分子，熱空氣含有較少快速分子的示意圖",
          caption: "相同氣壓不代表相同密度；分子數量與運動速度會共同影響氣壓。"
        }
      },
      {
        type: "comparison",
        title: "同樣 1 atm，為什麼密度不同？",
        items: [
          {
            label: "冷空氣",
            text: "分子移動較慢，每次碰撞造成的作用較弱，需要較多分子才能維持相同氣壓。"
          },
          {
            label: "熱空氣",
            text: "分子移動較快，每次碰撞造成的作用較強，即使分子較少仍能維持相同氣壓。"
          }
        ]
      },
      {
        type: "takeaway",
        title: "飛行上的結論",
        body: [
          "Pressure altitude 只反映氣壓；density altitude 還把非標準溫度的影響納入。",
          "高溫使空氣密度下降，飛機會感覺像在更高的高度飛行：升力、螺旋槳效率與引擎性能都可能降低。"
        ]
      }
    ]
  }
];
