async function test() {
  const majorId = 123;
  const payloads = [
      { method_id: 1, user_scores: { "A00": 24 }, filter: { major_ids: [majorId] } },
      { method_id: 1, user_blocks: [ { code: "A00", point: 24 } ], filter: { major_ids: [majorId] } },
      { method_id: 1, user_scores: { "toan": 8, "ly": 8, "hoa": 8 }, filter: { major_ids: [majorId] } }
    ];

    for (const payload of payloads) {
      console.log("Testing payload:", JSON.stringify(payload));
      const response = await fetch('https://diemthi.tuyensinh247.com/api/user/find-school', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'origin': 'https://diemthi.tuyensinh247.com',
          'referer': 'https://diemthi.tuyensinh247.com/tu-van-chon-truong.html',
          'user-agent': 'Mozilla/5.0'
        },
        body: JSON.stringify(payload)
      });
      const data: any = await response.json();
      console.log("Result lengths:", data.data ? Object.keys(data.data).map(k => `${k}: ${data.data[k].length || 0}`) : data);
    }
}
test().catch(console.error);
