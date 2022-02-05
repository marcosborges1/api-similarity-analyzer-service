const flatten = require("flat");
const { unflatten } = require("flat");

module.exports = {
	getAllIndexes: function (arr, val) {
		var indexes = [],
			i = -1;
		while ((i = arr.indexOf(val, i + 1)) != -1) {
			indexes.push(i);
		}
		return indexes;
	},
	replaceRange: function (s, start, end, substitute) {
		return s.substring(0, start) + substitute + s.substring(end);
	},
	extractArrayType: function (array) {
		const extratedArrays = [];
		const arrayAux = Object.entries(array);
		arrayAux.map((res) => {
			if (res[1] == "array") {
				extratedArrays.push(res[0]);
			}
		});
		return extratedArrays;
	},
	removeArrayType: function (array, fieldsTypedArray) {
		const keyArray = Object.entries(array);
		// console.log(keyArray);
		let auxField = fieldsTypedArray;
		let auxkeyArray = keyArray;

		const ra = auxField.map((res) => {
			auxkeyArray.map((resKey) => {
				resKey[0] = resKey[0].replace(res + ".", "");
				return resKey;
			});
			auxkeyArray = auxkeyArray.filter((a) => a[0] != res);
			return auxkeyArray;
		});

		return ra[auxField.length - 1];
	},
	getResponsesApi: function (method, value, reportAPI, keys, i) {
		if (value.hasOwnProperty(method)) {
			auxInfoValues = {};
			const aux =
				value[method]["responses"]["200"]["content"]["application/json"][
					"schema"
				];

			const entries = Object.entries(flatten(aux));

			entries.map((entry) => {
				const key = entry[0];
				const value = entry[1];

				if (RegExp(/.type/).test(key)) {
					const keyWord = "properties";
					const indexBegin = key.indexOf(keyWord);
					const newKey = module.exports
						.replaceRange(key, 0, indexBegin + 11, "")
						.replace(/properties./gi, "")
						.replace(".type", "");
					auxInfoValues[newKey] = value;
				}
			});

			const extractedArray = module.exports.extractArrayType(auxInfoValues);
			const newCorrectArray = module.exports.removeArrayType(
				auxInfoValues,
				extractedArray
			);

			let newArray = {};
			newCorrectArray.map((entry) => {
				newArray[entry[0]] = entry[1];
			});

			let keyMethod = {};
			keyMethod["response"] = unflatten(newArray);
			const auxMethod = {};
			auxMethod[method] = keyMethod;
			reportAPI[keys[i]] = auxMethod;
		}
	},
};
